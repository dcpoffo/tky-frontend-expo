import React from "react";
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./pages/Home";
import ListaProdutos from "./pages/Produtos/listar";
import ListaEstoque from "./pages/Estoque/listar";
import NovoProduto from "./pages/Produtos/novo";
import EditarProduto from "./pages/Produtos/editar";
import NovaMovimentacaoEstoque from "./pages/Estoque/novo";
import ListaVendas from "./pages/Vendas/listar";
import NovaVenda from "./pages/Vendas/nova";
import ListarConsignacoes from "./pages/Consignacao/listar";
import NovaConsignacao from "./pages/Consignacao/nova";

type StackNavigation = {
    Login: undefined;
    Home: undefined;
    Produtos: undefined;
    NovoProduto: undefined;
    EditarProduto: undefined;
    ListaEstoque: undefined;
    NovaMovimentacaoEstoque: undefined;
    TelaTeste: undefined;
    ListaVendas: undefined;
    NovaVenda: undefined;
    ListaConsignacoes: undefined;
    NovaConsignacao: undefined;
};

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

const Stack = createNativeStackNavigator<StackNavigation>();

function Routes() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Produtos"
                component={ListaProdutos}
                options={{ title: 'Lista de Produtos' }}
            />
            <Stack.Screen
                name="ListaEstoque"
                component={ListaEstoque}
                options={{ title: "Movimentação de Estoque" }}
            />

            <Stack.Screen
                name="NovaMovimentacaoEstoque"
                component={NovaMovimentacaoEstoque}
                options={{ title: "Entrada / Saida de Estoque" }}
            />

            <Stack.Screen
                name="NovoProduto"
                component={NovoProduto}
                options={{ title: 'Novo Produto' }}
            />
            <Stack.Screen
                name="EditarProduto"
                component={EditarProduto}
                options={{ title: 'Editar Produto' }}
            />

            <Stack.Screen
                name="ListaVendas"
                component={ListaVendas}
                options={{ title: 'Vendas' }}
            />

            <Stack.Screen
                name="NovaVenda"
                component={NovaVenda}
                options={{ title: 'Nova Venda' }}
            />

            <Stack.Screen
                name="ListaConsignacoes"
                component={ListarConsignacoes}
                options={{ title: 'Lista Consignações' }}
            />

            <Stack.Screen
                name="NovaConsignacao"
                component={NovaConsignacao}
                options={{ title: 'Nova Venda Consignada' }}
            />

        </Stack.Navigator>
    );
}

export default Routes;
