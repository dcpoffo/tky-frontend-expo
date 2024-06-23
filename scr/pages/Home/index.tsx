import { useNavigation } from "@react-navigation/native";
import { VStack, Text, Spinner } from "native-base";
import { StackTypes } from "../../routes";
import { Button } from "../../componentes/Button";

import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function Home() {

    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ loading, setLoading ] = useState(false); // Inicialmente, não está carregando

    async function verifyAvailableAuthentication() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        console.log(compatible);

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log(types.map(type => LocalAuthentication.AuthenticationType[ type ]));
    }

    async function handleAuthentication() {
        setLoading(true); // Inicia o carregamento
        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
        console.log(isBiometricEnrolled);

        if (!isBiometricEnrolled) {
            setLoading(false); // Carregamento concluído
            return Alert.alert('Login', 'Nenhuma biometria encontrada. Por favor cadastre no dispositivo!');
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Login com Biometria",
            fallbackLabel: "Biometria não reconhecida"
        });

        setIsAuthenticated(auth.success);
        setLoading(false); // Carregamento concluído após a autenticação
    }

    useEffect(() => {
        verifyAvailableAuthentication();
    }, []);

    const navigation = useNavigation<StackTypes>();

    function handleProdutos() {
        navigation.navigate('Produtos');
    }

    function handleEstoque() {
        navigation.navigate('ListaEstoque');
    }

    function handleVendas() {
        navigation.navigate('ListaVendas');
    }

    function handleTestes() {
        navigation.navigate('TelaTeste')
    }

    // Renderiza uma mensagem de carregamento enquanto está autenticando
    if (loading) {
        return (
            <VStack flex={1} alignItems={'center'} justifyContent={'center'} margin={4}>
                <Spinner size="lg" />
                <Text>Aguardando autenticação...</Text>
            </VStack>
        );
    }

    // Renderiza os botões somente se estiver autenticado
    if (isAuthenticated) {
        return (
            <VStack flex={1} alignItems={'center'} justifyContent={'center'} margin={4}>
                <Button
                    title="Produtos"
                    onPress={handleProdutos}
                    marginBottom={5}
                />

                <Button
                    title="Entrada/Saida Estoque"
                    onPress={handleEstoque}
                    marginBottom={5}
                />

                <Button
                    title="Vendas"
                    onPress={handleVendas}
                    marginBottom={5}
                />

                {/* <Button
                    title="Tela de Testes"
                    onPress={handleTestes}
                    marginBottom={5}
                /> */}
            </VStack>
        );
    }

    // Renderiza o botão de autenticação se não estiver autenticado
    return (
        <VStack flex={1} alignItems={'center'} justifyContent={'center'} margin={4}>
            {/* <MaterialIcons name="warning" size={50} color="red" /> */}
            <Text>Autenticação necessária para acessar esta página.</Text>
            <Button
                title="Autenticar"
                onPress={handleAuthentication}
                marginTop={5}
            />
        </VStack>
    );
}
