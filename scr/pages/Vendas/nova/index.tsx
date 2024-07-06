import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { Box, Center, CheckIcon, Divider, HStack, Heading, Icon, IconButton, Pressable, Select, Text, VStack, WarningOutlineIcon, useToast } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from 'react-native';
import * as yup from "yup";
import { Button } from "../../../componentes/Button";
import { Input } from "../../../componentes/Input";
import { StackTypes } from "../../../routes";
import { useAPI } from "../../../service/API";

const schema = yup.object({
    idProduto: yup
        .number()
        .required("Informe o produto"),
    quantidade: yup
        .number()
        .required('Informe a quantidade')
        .integer('A quantidade deve ser um valor inteiro')
        .moreThan(0, 'O valor deve ser maior que zero'),
    valorUnitario: yup
        .number()
        .required('Informe o Valor')
        .typeError('O valor deve ser um número válido'),
    descricao: yup
        .string()
        .required("Informe a descrição")
        .min(5, "Descrição com no mínimo 5 caracteres")
        .max(200, "No máximo 200 caracteres"),
});

type FormVendasProps = {
    idProduto: number;
    quantidade: number;
    valorUnitario: number;
    descricao: string;
};

type ProdutoProps = {
    id: number;
    descricao: string;
    tipo: string;
    modelagem: string;
    grade: string;
    barra: string;
};

type ItemVenda = {
    id: number; // Adicionamos o id para identificar cada item de venda de forma única
    idProduto: number;
    produto: string;
    quantidade: number;
    valorUnitario: number;
    total: number;
};

export default function NovaVenda() {
    const [ produtos, setProdutos ] = useState<ProdutoProps[]>([]);
    const [ itensDaVenda, setItensDaVenda ] = useState<ItemVenda[]>([]);
    const [ totalVenda, setTotalVenda ] = useState<number>(0);
    const [ isPressed, setIsPressed ] = useState(false);
    const toast = useToast();
    const navigation = useNavigation<StackTypes>();
    const api = useAPI();

    const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm<FormVendasProps>({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        carregarProdutos();
    }, []);

    useEffect(() => {
        calcularTotal();
    }, [ itensDaVenda ]);

    const carregarProdutos = async () => {
        try {
            const result = await api.get("/produtos");
            setProdutos(result.data);
        } catch (e) {
            console.log("Erro ao carregar produtos:", e);
        }
    };

    const adicionarItemVenda = (data: FormVendasProps) => {
        const { idProduto, quantidade, valorUnitario } = data;

        if (idProduto && quantidade && valorUnitario) {
            const produtoSelecionado = produtos.find(produto => produto.id === idProduto);

            if (produtoSelecionado) {
                //const total = parseFloat(valorUnitario.toString()) * parseInt(quantidade.toString());
                const total = valorUnitario * quantidade;
                const novoItem: ItemVenda = {
                    id: Date.now(),
                    idProduto: produtoSelecionado.id,
                    produto: `${produtoSelecionado.descricao} ${produtoSelecionado.modelagem} ${produtoSelecionado.tipo} ${produtoSelecionado.grade}`,
                    quantidade,
                    valorUnitario,
                    total
                };
                setItensDaVenda([ ...itensDaVenda, novoItem ]);
                reset({
                    ...getValues(),
                    idProduto: undefined,
                    quantidade: undefined,
                    valorUnitario: undefined,
                });
            }
        }
    };

    const removerItemVenda = (itemId: number) => {
        const novosItens = itensDaVenda.filter(item => item.id !== itemId);
        setItensDaVenda(novosItens);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const calcularTotal = () => {
        let total = 0;
        itensDaVenda.forEach(item => {
            total += item.total;
        });
        setTotalVenda(total);
    };

    async function handleCadastrar() {
        const { descricao } = getValues();

        if (itensDaVenda.length === 0) {
            toast.show({
                description: 'Adicione pelo menos um item à venda!',
                placement: 'top',
                bg: 'yellow.500',
                fontSize: 'lg'
            });
            return;
        }

        try {
            const response = await api.post("/vendas", {
                descricao: descricao,
                itensVenda: itensDaVenda.map(item => ({
                    idProduto: item.idProduto,
                    quantidade: item.quantidade,
                    valorUnitario: item.valorUnitario
                }))
            });

            if (!response.data.errors) {
                toast.show({
                    description: 'Venda realizada com sucesso!',
                    placement: 'top',
                    bg: 'green.500',
                    fontSize: 'md'
                });
            }
            navigation.goBack();
        } catch (erro: any) {
            if (erro.isAxiosError) {
                toast.show({
                    description: erro.response.data.message,
                    placement: 'top',
                    bg: 'red.500',
                    fontSize: 'md'
                });
            } else {
                toast.show({
                    description: 'Erro ao cadastrar venda!',
                    placement: 'top',
                    bg: 'red.500',
                    fontSize: 'md'
                });
            }
        }
    }

    return (
        <ScrollView>
            <VStack flex={1} px={3}>
                <Center>
                    <Heading mb={2} mt={2}>Nova Vendas</Heading>

                    <Controller
                        control={control}
                        name='descricao'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                marginTop={4}
                                placeholder='Descrição'
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.descricao?.message}
                                isDisabled={itensDaVenda.length > 0}
                                isReadOnly={itensDaVenda.length > 0}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name='idProduto'
                        render={({ field: { onChange, value } }) => (
                            <Box width={"full"}>
                                <Select
                                    fontSize={16}
                                    borderRadius={10}
                                    borderWidth={2}
                                    borderColor={errors.idProduto ? 'red.500' : 'gray.900'}
                                    placeholderTextColor="gray.500"
                                    selectedValue={value !== undefined ? value.toString() : ""}
                                    minWidth="200"
                                    height={16}
                                    accessibilityLabel="Selecione o produto"
                                    placeholder="Selecione o produto"
                                    _selectedItem={{
                                        bg: "blue.600",
                                        endIcon: <CheckIcon size="5" color="white" />,
                                        _text: { color: 'white' }
                                    }}
                                    mt={1}
                                    onValueChange={itemValue => onChange(Number(itemValue))}
                                >
                                    {produtos.length === 0 ? (
                                        <Select.Item label="Nenhum produto encontrado" value="" />
                                    ) : (
                                        produtos.map(produto => (
                                            produto.id && produto.descricao ? (
                                                <Select.Item
                                                    key={produto.id.toString()}
                                                    label={`${produto.id} - ${produto.descricao} ${produto.modelagem} ${produto.tipo} ${produto.grade}`}
                                                    value={produto.id.toString()}
                                                />
                                            ) : null
                                        ))
                                    )}
                                </Select>
                                {errors.idProduto && (
                                    <Box alignSelf={'stretch'}>
                                        <HStack mt={2} alignItems="center">
                                            <WarningOutlineIcon size="xs" color="red.500" />
                                            <Text fontSize={12} color="red.500" ml={1}>
                                                {errors.idProduto.message}
                                            </Text>
                                        </HStack>
                                    </Box>
                                )}
                            </Box>
                        )}
                    />

                    <Controller
                        control={control}
                        name='quantidade'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                marginTop={4}
                                keyboardType="numeric"
                                placeholder='Quantidade'
                                value={value !== undefined ? value.toString() : ''}
                                onChangeText={(text) => onChange(Number(text))}
                                errorMessage={errors.quantidade?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name='valorUnitario'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                keyboardType="numeric"
                                placeholder='Valor Unitário'
                                //value={value !== undefined ? value.toString() : ''}
                                onChangeText={(text) => onChange(parseFloat(text.replace(',', '.')))} // Permite usar vírgula ou ponto
                                errorMessage={errors.valorUnitario?.message}
                            />
                        )}
                    />                    
                    
                </Center>

                <HStack justifyContent="space-between" alignItems="center" px={3}>
                    <Pressable
                        onPress={handleSubmit(adicionarItemVenda)}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        backgroundColor={isPressed ? "blue.400" : "blue.600"}
                        borderRadius={100}
                        padding={3}
                        width={50}
                        alignItems='center'
                    >
                        <Icon as={Ionicons} name="add" size="lg" color="white" />
                    </Pressable>

                    <HStack>
                        <Text fontSize="xl" fontWeight={"bold"}>Total: </Text>
                        <Text
                            fontSize="xl"
                            color="red.500"
                            fontWeight={"bold"}
                        >
                            {formatCurrency(totalVenda)}
                        </Text>
                    </HStack>
                </HStack>

                {itensDaVenda.length > 0 && (
                    <Box>
                        <Divider my={2} color={'black'} thickness={2} />

                        <Center>
                            <Heading size="md">Itens da Venda</Heading>
                        </Center>

                        {itensDaVenda.map(item => (
                            <Box key={item.id} p={2} borderBottomWidth={1} borderBottomColor="gray.200">
                                <HStack justifyContent="space-between">
                                    <VStack>
                                        <Text>Produto: {item.produto}</Text>
                                        <Text>Quantidade: {item.quantidade}</Text>
                                        <Text>Valor Unitário: {formatCurrency(item.valorUnitario)}</Text>
                                        <Text>Total: {formatCurrency(item.total)}</Text>
                                    </VStack>
                                    <IconButton
                                        variant="unstyled"
                                        icon={<Icon as={Ionicons} name="close-circle" size="xl" color="red.500" />}
                                        onPress={() => removerItemVenda(item.id)}
                                    />
                                </HStack>
                            </Box>
                        ))}
                    </Box>
                )}

                <Divider my={2} color={'black'} thickness={2} />

                <Button
                    title='Finalizar venda'
                    onPress={handleCadastrar}
                />
            </VStack>
        </ScrollView>
    );
}
