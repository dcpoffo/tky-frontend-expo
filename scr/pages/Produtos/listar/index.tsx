import React, { useEffect, useState } from 'react';
import { FlatList, HStack, Pressable, Spinner, Text, VStack } from 'native-base';
import { Button } from '../../../componentes/Button';
import { useAPI } from '../../../service/API';
import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../../routes';

export default function ListaProdutos() {

    const [ loading, setLoading ] = useState(true);
    const [ produtos, setProdutos ] = useState<any[]>([]);

    const api = useAPI();
    const navigation = useNavigation<StackTypes>();

    useEffect(() => {
        loadProducts();
    }, [produtos]);

    const loadProducts = async () => {
        try {
            const result = await api.get("/produtos");
            setProdutos(result.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    function handleNovo() {
        navigation.navigate('NovoProduto');
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
        <VStack flex={1} px={2} justifyContent={"center"} >
            <Button
                title='Novo Produto'
                onPress={handleNovo}
                // onPress={() => { navigation.navigate('NovoProduto') }}
                marginTop={3}
                marginBottom={3}
            />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={produtos}
                renderItem={({ item }) =>
                    <Pressable
                        onPress={() => {
                            const produtoSelecionado = {
                                id: item.id,
                                descricao: item.descricao,
                                tipo: item.tipo,
                                modelagem: item.modelagem,
                                grade: item.grade,
                                barra: item.barra,
                                qtdEstoque: item.qtdEstoque
                            }
                            navigation.navigate('EditarProduto', { item });
                        }}
                        rounded="8"
                        overflow="hidden"
                        borderWidth="1"
                        borderColor="coolGray.300"
                        bg="coolGray.200"
                        p="2"
                        marginBottom={2}
                    >
                        <HStack justifyContent={'space-between'}>
                            <Text fontWeight={'bold'} fontSize={16}>Descrição</Text>
                            <Text fontWeight={'bold'} fontSize={16}>Tipo</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text fontSize={16}>{item.descricao}</Text>
                            <Text fontSize={16}>{item.tipo}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text fontWeight={'bold'} fontSize={16}>Modelagem</Text>
                            <Text fontWeight={'bold'} fontSize={16}>Grade</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text fontSize={16}>{item.modelagem}</Text>
                            <Text fontSize={16}>{item.grade}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text fontWeight={'bold'} fontSize={16}>Cód. Barra</Text>
                            <Text fontWeight={'bold'} fontSize={16}>Qtd. Estoque</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text fontSize={16}>{item.barra}</Text>
                            <Text fontSize={16}>{item.qtdEstoque || 0}</Text>
                        </HStack>
                    </Pressable>
                }
            />
        </VStack>
    );
}
