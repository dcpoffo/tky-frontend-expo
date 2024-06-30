import { Ionicons } from '@expo/vector-icons';
import { Box, Center, HStack, Heading, Radio, Text, VStack, WarningOutlineIcon, useToast, Select, CheckIcon, FlatList, ScrollView, Pressable, Icon, Divider, IconButton } from "native-base";
import * as yup from "yup";
import { useAPI } from "../../../service/API";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../../../routes";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../componentes/Button";
import { Input } from "../../../componentes/Input";
import { useEffect, useState } from "react";

const schema = yup.object({
    idProduto: yup
        .number()
        .required("Informe o produto"),
    tipo: yup
        .string()
        .oneOf([ '0', '1' ], "Selecione Entrada ou Saída")
        .required("Selecione a movimentação: Entrada / Saida"),
    descricao: yup
        .string()
        .required("Informe a descrição da movimentação")
        .min(5, "No mínimo 5 caracteres")
        .max(50, "No máximo 50 caracteres"),
    quantidade: yup
        .number()
        .required('Informe a quantidade')
        .moreThan(0, 'O valor deve ser maior que zero'),
});

type FormMovimentacaoProps = {
    idProduto: number;
    tipo: "ENTRADA" | "SAIDA";
    descricao: string;
    quantidade: number;
};

type ProdutoProps = {
    id: number;
    descricao: string;
    tipo: string;
    modelagem: string;
    grade: string;
    barra: string;
};

type ItemMovimentacao = {
    id: number;
    idProduto: number;
    produto: string;
    quantidade: number;
}

export default function NovaMovimentacaoEstoque() {

    const [ produtos, setProdutos ] = useState<ProdutoProps[]>([]);
    const [ itensdaMovimentacao, setItensdaMovimentcao ] = useState<ItemMovimentacao[]>([]);
    const [ isPressed, setIsPressed ] = useState(false);
    const toast = useToast();
    const navigation = useNavigation<StackTypes>();
    const api = useAPI();

    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm<FormMovimentacaoProps>({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const result = await api.get("/produtos");
            setProdutos(result.data);
        } catch (e) {
            console.log("Erro ao carregar produtos:", e);
        }
    };

    const adicionarItemMovimentacao = (data: FormMovimentacaoProps) => {
        const { idProduto, quantidade } = data;

        const produtoSelecionado = produtos.find(produto => produto.id === idProduto);

        if (produtoSelecionado) {
            const novoItem: ItemMovimentacao = {
                id: Date.now(),
                idProduto: produtoSelecionado.id,
                produto: `${produtoSelecionado.descricao} ${produtoSelecionado.modelagem} ${produtoSelecionado.tipo} ${produtoSelecionado.grade}`,
                quantidade
            };
            setItensdaMovimentcao([ ...itensdaMovimentacao, novoItem ]);
            reset({
                ...getValues(), // Mantém tipo e descrição
                quantidade: undefined, // Limpa apenas a quantidade
                idProduto: undefined, // Limpa apenas o produto
            });
        }
    };

    const removerItemMovimentacao = (itemId: number) => {
        const novosItens = itensdaMovimentacao.filter(item => item.id !== itemId);
        setItensdaMovimentcao(novosItens);
    }

    async function handleCadastrar() {
        const { tipo, descricao } = getValues();

        if (itensdaMovimentacao.length === 0) {
            toast.show({
                description: 'Adicione pelo menos um item à movimentação!',
                placement: 'top',
                bg: 'yellow.500',
                fontSize: 'lg'
            });
            return;
        }

        try {
            const response = await api.post("/movimentacoesEstoque", {
                tipo: tipo,
                descricao: descricao,
                itensMovimentacaoEstoque: itensdaMovimentacao.map(item => ({
                    idProduto: item.idProduto,
                    quantidade: item.quantidade
                }))
            });

            if (!response.data.errors) {
                toast.show({
                    description: 'Movimentação cadastrada com sucesso!',
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
                    description: 'Erro ao cadastrar movimentação!',
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
                    <Heading mt={2} mb={2}>Nova Movimentação de Estoque</Heading>

                    <Controller
                        control={control}
                        name='tipo'
                        render={({ field: { onChange, value } }) => (
                            <Box
                                alignItems={'center'}
                                h={16}
                                w={'full'}
                                borderWidth={2}
                                borderColor={errors.tipo ? 'red.500' : 'gray.900'}
                                borderRadius={10}
                                justifyContent={'center'}
                                pointerEvents={itensdaMovimentacao.length > 0 ? 'none' : 'auto'}
                                opacity={itensdaMovimentacao.length > 0 ? 0.5 : 1}
                            >
                                <Radio.Group
                                    defaultValue={value !== undefined ? value.toString() : ""}
                                    onChange={onChange}
                                    name="radioGroupTipo"
                                    disabled={itensdaMovimentacao.length > 0}
                                >
                                    <HStack space={'1/4'}>
                                        <Radio value="0" my={1} disabled={itensdaMovimentacao.length > 0}>
                                            Entrada
                                        </Radio>
                                        <Radio value="1" my={1} disabled={itensdaMovimentacao.length > 0}>
                                            Saída
                                        </Radio>
                                    </HStack>
                                </Radio.Group>
                            </Box>
                        )}
                    />
                    {errors.tipo && (
                        <Box alignSelf={'stretch'}>
                            <HStack mt={2} alignItems="center">
                                <WarningOutlineIcon size="xs" color="red.500" />
                                <Text
                                    fontSize={12}
                                    color="red.500"
                                    ml={1}
                                >
                                    {errors.tipo.message}
                                </Text>
                            </HStack>
                        </Box>
                    )}

                    <Controller
                        control={control}
                        name='descricao'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                marginTop={4}
                                placeholder='Descrição (Ex: Acerto no estoque)'
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.descricao?.message}
                                isDisabled={itensdaMovimentacao.length > 0}
                                isReadOnly={itensdaMovimentacao.length > 0}
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
                                        _text: { color: 'white' }  // Altera a cor do texto do item selecionado
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
                                            <Text
                                                fontSize={12}
                                                color="red.500"
                                                ml={1}
                                            >
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
                                mt={4}
                                keyboardType="numeric"
                                placeholder='Quantidade'
                                value={value !== undefined ? value.toString() : ''}
                                onChangeText={(text) => onChange(Number(text))}
                                errorMessage={errors.quantidade?.message}
                            />
                        )}
                    />

                    <HStack justifyContent="flex-start" width="full">
                        <Pressable
                            onPress={handleSubmit(adicionarItemMovimentacao)}
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
                    </HStack>

                    {itensdaMovimentacao.length > 0 && (
                        <Box width={'full'} marginX={3}>
                            <Divider my={2} color={'black'} thickness={2} />

                            <Center>
                                <Heading size="md">Itens da Movimentação</Heading>
                            </Center>

                            {itensdaMovimentacao.map(item => (
                                <Box key={item.id} p={2} borderBottomWidth={1} borderBottomColor="gray.200">
                                    <HStack justifyContent="space-between">
                                        <VStack>
                                            <Text>Produto: {item.produto}</Text>
                                            <Text>Quantidade: {item.quantidade}</Text>
                                        </VStack>
                                        <IconButton
                                            variant="unstyled"
                                            icon={<Icon as={Ionicons} name="close-circle" size="xl" color="red.500" />}
                                            onPress={() => removerItemMovimentacao(item.id)}
                                        />
                                    </HStack>
                                </Box>
                            ))}
                        </Box>
                    )}

                    <Divider my={2} color={'black'} thickness={2} />

                    <Button
                        title='Finalizar movimentação'
                        onPress={handleCadastrar}
                    />

                </Center>
            </VStack>
        </ScrollView>
    );
}
