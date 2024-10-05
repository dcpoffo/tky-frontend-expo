/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { } from 'react-native'
import { Text, Heading, useToast, VStack, Spinner, FlatList, Pressable, HStack, Divider, Box } from 'native-base'
import { Button } from '../../../componentes/Button'
import { StackTypes } from '../../../routes';
import { useNavigation } from '@react-navigation/native';
import { useAPI } from '../../../service/API';
import { Input } from '../../../componentes/Input';

export default function ListarConsignacoes() {

    const [ vendas, setVendas ] = useState<any[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ filteredVendas, setFilteredVendas ] = useState<any[]>([]);
    const [ searchTerm, setSearchTerm ] = useState('');

    const api = useAPI();
    const toast = useToast();
    const navigation = useNavigation<StackTypes>();

    useEffect(() => {
        loadVendas();        
    }, [ vendas ])

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredVendas(vendas);
        } else {
            vendasFiltradas(searchTerm);
        }
    }, [ searchTerm, vendas ]);

    const vendasFiltradas = (term: string) => {
        const filtered = vendas.filter(venda =>
            venda.descricao.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredVendas(filtered);
    };

    function handleNovaVenda() {
        navigation.navigate("NovaConsignacao");
    }

    const loadVendas = async () => {
        try {
            const result = await api.get("/consignacoes");
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
                title="Nova Venda Consignada"
                onPress={handleNovaVenda}
                marginTop={3}
                marginBottom={3}
            />
            
            <Text fontWeight={'bold'} fontSize={16}>Pesquisar pela descrição</Text>
            <Input
                placeholder='Descrição da venda'
                value={searchTerm}
                fontSize={15}
                h={10}
                onChangeText={(text) => setSearchTerm(text)}
            />

            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredVendas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                    <Box
                        bg={"coolGray.200"}
                        rounded={"8"}
                        overflow={"hidden"}
                        borderWidth={1}
                        borderColor={"coolGray.400"}
                        p={2}
                        marginBottom={2}
                    >

                        <HStack justifyContent={"space-between"}>                            
                            <HStack>
                                <Text fontSize={16} color={'#2f59f5'} fontWeight={'bold'}>
                                    {new Date(item.data).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </HStack>
                        </HStack>

                        <VStack>
                            {/* <Text fontWeight={'bold'}>Descrição da Venda</Text> */}
                            <Text>{item.descricao}</Text>
                        </VStack>
                        

                        {item.itensConsignacao && item.itensConsignacao.length > 0 && (
                            <VStack >
                                <HStack>
                                    <Text fontWeight={'bold'} width={50}>Item</Text>
                                    <Text fontWeight={'bold'} width={50}>Qtde</Text>
                                    <Text fontWeight={'bold'} width={"full"}>Produto</Text>
                                </HStack>

                                {item.itensConsignacao.map((itemConsignacao, index) => (
                                    <VStack key={index} >
                                        <HStack>
                                            <Text width={50}>{index + 1}</Text>
                                            <Text width={50}>{itemConsignacao.quantidade}</Text>                                            
                                            <Text width={'full'}>
                                                {/* {itemConsignacao.idProduto} - {itemConsignacao.produto.descricao} {itemConsignacao.produto.modelagem} {itemConsignacao.produto.tipo} {itemConsignacao.produto.grade} */}
                                                {itemConsignacao.produto.descricao} {itemConsignacao.produto.modelagem} {itemConsignacao.produto.tipo} {itemConsignacao.produto.grade}
                                            </Text>
                                        </HStack>
                                        
                                        {/* {index < item.itensConsignacao.length - 1 && <Divider my={2} color={'coolGray.400'} thickness={2} />} */}
                                    </VStack>

                                ))}
                            </VStack>
                        )}


                    </Box>
                }
            />
            
        </VStack>
    )

}