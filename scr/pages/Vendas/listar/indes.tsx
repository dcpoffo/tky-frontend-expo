import React, { useEffect, useState } from 'react'
import { } from 'react-native'
import { Center, Heading, VStack, Text, Spinner, useToast, FlatList, Pressable, HStack, Divider } from 'native-base'
import { useAPI } from '../../../service/API';
import { Button } from '../../../componentes/Button';
import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../../routes';

export default function ListaVendas() {

    const [ vendas, setVendas ] = useState<any[]>([]);
    const [ loading, setLoading ] = useState(true);

    const api = useAPI();
    const toast = useToast();
    const navigation = useNavigation<StackTypes>();

    useEffect(() => {
        loadVendas();
    }, [ vendas ]);

    const loadVendas = async () => {
        try {
            const result = await api.get("/vendas");
            setVendas(result.data); 
        } catch (e) {
            toast.show({
                description: "Erro ao carregar dados. Tente novamente mais tarde.",
                bg: "red.500"
            });
        }
        finally {
            setLoading(false);
        }
    };

    function handleNovaVenda() {
        navigation.navigate("NovaVenda");
    }

    if (loading) {
        return (
            <VStack flex={1} justifyContent={'center'} alignItems={'center'}>
                <Text marginBottom={5} fontSize={16} fontWeight={'bold'}>
                    Carregando informações...
                </Text>
                <Spinner size={'lg'} />
            </VStack>
        )
    }

    return (
        <VStack flex={1} px={2}>

            <Button
                title="Nova venda"
                onPress={handleNovaVenda}
                marginTop={3}
                marginBottom={3}
            />

            <FlatList
                showsVerticalScrollIndicator={false}
                data={vendas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                    <Pressable
                        bg={"coolGray.200"}
                        rounded={"8"}
                        overflow={"hidden"}
                        borderWidth={1}
                        borderColor={"coolGray.400"}
                        p={2}
                        marginBottom={2}
                    >

                        <HStack justifyContent={"space-between"}>

                            <VStack>
                                <HStack>
                                    <Text color={'#2f59f5'} fontWeight={'bold'} fontSize={16}>Valor da Venda: </Text>
                                    <Text fontSize={16} color="red.500">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorVenda)}
                                    </Text>
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

                        {item.itensDaVenda && item.itensDaVenda.length > 0 && (
                            <VStack >
                                {/* <Text color={'#2f59f5'} fontWeight={'bold'} fontSize={16}>Itens da Venda</Text> */}

                                <HStack>
                                    <Text fontWeight={'bold'} width={50}>Item</Text>
                                    <Text fontWeight={'bold'} width={100}>Quantidade</Text>
                                    {/* <Text fontSize={12} fontWeight={'bold'} width={130}>Produto</Text> */}
                                    <Text fontWeight={'bold'} width={100}>R$ Unitário</Text>
                                    <Text fontWeight={'bold'} width={100}>Total</Text>
                                </HStack>

                                {item.itensDaVenda.map((itemVenda, index) => (
                                    <VStack key={index} >
                                        <HStack>
                                            <Text width={50}>{index + 1}</Text>
                                            <Text width={100}>{itemVenda.quantidade}</Text>
                                            <Text width={100}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemVenda.valorUnitario)}
                                            </Text>
                                            <Text width={100}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemVenda.total)}
                                            </Text>
                                        </HStack>
                                        <HStack>
                                            <Text width={'full'}>
                                                {itemVenda.idProduto} - {itemVenda.produto.descricao} {itemVenda.produto.modelagem} {itemVenda.produto.tipo} {itemVenda.produto.grade}
                                            </Text>
                                        </HStack>
                                        {index < item.itensDaVenda.length - 1 && <Divider my={2} color={'coolGray.400'} thickness={2}/>}
                                    </VStack>
                                    
                                ))}
                            </VStack>
                        )}

                    </Pressable>
                }
            />
        </VStack>
    )
}
