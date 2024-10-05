import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, Divider, FlatList, HStack, Icon, IconButton, Spinner, Text, useToast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { } from 'react-native';
import { Button } from '../../../componentes/Button';
import { StackTypes } from '../../../routes';
import { useAPI } from '../../../service/API';
import { Input } from '../../../componentes/Input';

export default function ListaVendas() {

    const [ vendas, setVendas ] = useState<any[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ filteredVendas, setFilteredVendas ] = useState<any[]>([]);
    const [ searchTerm, setSearchTerm ] = useState('');

    const api = useAPI();
    const toast = useToast();
    const navigation = useNavigation<StackTypes>();

    useEffect(() => {
        loadVendas();
    }, [ vendas ]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredVendas(vendas);
        } else {
            vendasFiltradas(searchTerm);
        }
    }, [ searchTerm, vendas ]);

    const loadVendas = async () => {
        try {
            const result = await api.get("/vendas");
            setVendas(result.data);
            setFilteredVendas(result.data)
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

    const vendasFiltradas = (term: string) => {
        const filtered = vendas.filter(venda =>
            venda.descricao.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredVendas(filtered);
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
                        <HStack justifyContent={"flex-end"}>
                            {/* {item.consignacao && (
                                <Text fontWeight={'bold'} color={'red.500'}>VENDA DE CONSIGNAÇÃO</Text>
                            )} */}
                            {item.consignacao && (
                                <IconButton
                                    variant="unstyled"
                                    icon={<Icon as={Ionicons} name="basket" size="lg" color="red.400" />}
                                />
                            )}                            
                        </HStack>

                        <HStack justifyContent={"space-between"}>
                            <HStack>
                                <Text color={'#2f59f5'} fontWeight={'bold'} fontSize={16}>Valor da Venda: </Text>
                                <Text fontSize={16} color="red.500">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorVenda)}
                                </Text>
                            </HStack>
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
                            <Text>{item.descricao}</Text>
                        </VStack>

                        {item.itensDaVenda && item.itensDaVenda.length > 0 && (
                            <VStack >
                                <HStack>
                                    <Text fontWeight={'bold'} width={50}>Item</Text>
                                    <Text fontWeight={'bold'} width={100}>Quantidade</Text>
                                    {/* <Text fontSize={12} fontWeight={'bold'} width={130}>Produto</Text> */}
                                    <Text fontWeight={'bold'} width={100}>R$ Unitário</Text>
                                    <Text fontWeight={'bold'} width={100}>R$ Total</Text>
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
                                                {/* {itemVenda.idProduto} - {itemVenda.produto.descricao} {itemVenda.produto.modelagem} {itemVenda.produto.tipo} {itemVenda.produto.grade} */}
                                                {itemVenda.produto.descricao} {itemVenda.produto.modelagem} {itemVenda.produto.tipo} {itemVenda.produto.grade}
                                            </Text>
                                        </HStack>
                                        {index < item.itensDaVenda.length - 1 && <Divider my={2} color={'coolGray.400'} thickness={2} />}
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
