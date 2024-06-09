/* eslint-disable */

import { Box, Center, HStack, Heading, Radio, Text, VStack, WarningOutlineIcon, useToast, Select, CheckIcon, FlatList } from "native-base";
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
        .required("Informe o código do produto"),
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

type FormDataProps = {
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

export default function NovaMovimentacaoEstoque() {

    const [ produtos, setProdutos ] = useState<ProdutoProps[]>([]);

    const toast = useToast();
    const navigation = useNavigation<StackTypes>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(schema)
    });

    const api = useAPI();

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const result = await api.get("/produtos");
            // console.log("Produtos carregados:", result.data); // Log para verificar os dados
            setProdutos(result.data);
        } catch (e) {
            console.log("Erro ao carregar produtos:", e);
        }
    };

    async function handleCadastrar(data: FormDataProps) {

        try {
            const response = await api.post("/estoqueMove", {
                idProduto: data.idProduto,
                tipo: data.tipo,
                descricao: data.descricao,
                quantidade: data.quantidade
            });
            // console.log(response.data);

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
            console.log(`**** ${erro}`);

            // Verifica se o erro é uma instância do AxiosError
            if (erro.isAxiosError) {
                // Exibe a mensagem de erro específica retornada pela API
                toast.show({
                    description: erro.response.data.message,
                    placement: 'top',
                    bg: 'red.500',
                    fontSize: 'md'
                });

            } else {
                // Exibe uma mensagem de erro genérica para erros que não são AxiosError
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
        <VStack flex={1} px={3}>
            <Center>
                <Heading mt={2} mb={2}>Nova Movimentação de Estoque</Heading>

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
                    name='tipo'
                    render={({ field: { onChange, value } }) => (
                        <Box
                            mt={4}
                            alignItems={'center'}
                            h={16}
                            w={'full'}
                            borderWidth={2}
                            borderColor={errors.tipo ? 'red.500' : 'gray.900'}
                            borderRadius={10}
                            justifyContent={'center'}
                        >
                            <Radio.Group
                                defaultValue={value !== undefined ? value.toString() : ""}
                                onChange={onChange}
                                name="radioGroupTipo"
                            >
                                <HStack space={'1/4'}>
                                    <Radio value="0" my={1}>
                                        Entrada
                                    </Radio>
                                    <Radio value="1" my={1}>
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
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='quantidade'
                    render={({ field: { onChange, value } }) => (
                        <Input
                            keyboardType="numeric"
                            placeholder='Quantidade'
                            value={value !== undefined ? value.toString() : ''}
                            onChangeText={(text) => onChange(Number(text))}
                            errorMessage={errors.quantidade?.message}
                        />
                    )}
                />

                <Button
                    title='Salvar'
                    onPress={handleSubmit(handleCadastrar)}
                />
            </Center>
        </VStack>
    );
}
