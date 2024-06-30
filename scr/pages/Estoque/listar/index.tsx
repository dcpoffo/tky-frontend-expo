/* eslint-disable */

import { Divider, FlatList, HStack, Pressable, Spinner, Text, VStack, useToast } from "native-base";
import { Button } from "../../../componentes/Button";
import { useEffect, useState } from "react";
import { useAPI } from "../../../service/API";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../../../routes";


export default function ListaEstoque() {

    const [ loading, setLoading ] = useState(true);
    const [ movimentacoesEstoque, setMovimentacoesEstoque ] = useState<any[]>([]);

    const navigation = useNavigation<StackTypes>();
    const api = useAPI();
    const toast = useToast();

    useEffect(() => {
        loadMovimentacoesEstoque()
    }, [ movimentacoesEstoque ]);

    const loadMovimentacoesEstoque = async () => {
        try {
            const result = await api.get("/estoque");
            setMovimentacoesEstoque(result.data);
            //console.log(result.data)
        } catch (e) {
            console.log(e);
            toast.show({
                description: "Erro ao carregar dados. Tente novamente mais tarde.",
                bg: "red.500"
            });
        }
        finally {
            setLoading(false);
        }
    }

    function handleNovo() {
        navigation.navigate("NovaMovimentacaoEstoque");
    }

    if (loading) {
        return (
            <VStack flex={1} justifyContent={'center'} alignItems={'center'}>
                <Text marginBottom={5} fontSize={16} fontWeight={'bold'}>
                    Carregando informações
                </Text>
                <Spinner size={'lg'} />
            </VStack>
        )
    }

    return (
        <>
            <VStack flex={1} px={2}>

                <Button
                    title="Nova movimentação"
                    onPress={handleNovo}
                    marginTop={3}
                    marginBottom={3}
                />

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={movimentacoesEstoque}
                    renderItem={({ item }) =>
                        <>
                            <Pressable
                                bg={"coolGray.200"}
                                rounded={"8"}
                                overflow={"hidden"}
                                borderWidth={1}
                                borderColor={"coolGray.400"}
                                p={2}
                                marginBottom={1}
                            >

                                <HStack justifyContent={"space-between"}>

                                    <VStack>
                                        <HStack>
                                            {/* <Text color={'#2f59f5'} fontWeight={'bold'} fontSize={16}>Tipo: </Text> */}
                                            {
                                                item.tipo === '0'
                                                    ? <Text fontSize={16} color={'#2ecc71'}>Entrada</Text>
                                                    : <Text fontSize={16} color={'#e74c3c'}>Saida</Text>
                                            }
                                        </HStack>
                                    </VStack>

                                    <VStack>
                                        <HStack>
                                            <Text fontSize={16} color={'#2f59f5'} fontWeight={'bold'}>
                                                {new Date(item.data).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </Text>
                                        </HStack>
                                    </VStack>

                                </HStack>

                                <HStack>
                                    <Text color={'#2f59f5'} fontWeight={'bold'} fontSize={16}>Descrição: </Text>
                                    <Text fontSize={16}>{item.descricao} </Text>
                                </HStack>
                                <HStack>
                                    <Text width={50} color={'#2f59f5'} fontWeight={'bold'} fontSize={16}>Qtde</Text>
                                    <Text width={'full'} color={'#2f59f5'} fontWeight={'bold'} fontSize={16}>Produto</Text>
                                </HStack>

                                {item.itensMovimentacaoEstoque.map((itemMovimentacao, index) => (
                                    <VStack key={index} >                                        
                                        <HStack>
                                            <Text width={50}>{itemMovimentacao.quantidade}</Text>                                            
                                            <Text width={'full'}>
                                                {itemMovimentacao.idProduto} - {itemMovimentacao.produto.descricao} {itemMovimentacao.produto.modelagem} {itemMovimentacao.produto.tipo} {itemMovimentacao.produto.grade}
                                            </Text>
                                        </HStack>
                                        {/* {index < item.itensMovimentacaoEstoque.length - 1 && <Divider color={'coolGray.400'} thickness={2} />} */}
                                    </VStack>

                                ))}
                            </Pressable>
                        </>
                    }
                />
            </VStack>
        </>

    )

}

