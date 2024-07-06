/* eslint-disable */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../../routes';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Center, HStack, Heading, Radio, Text, VStack, WarningOutlineIcon, useToast } from 'native-base';
import { Button } from '../../../componentes/Button';
import { Input } from '../../../componentes/Input';
import { useAPI } from '../../../service/API';

const schema = yup.object({
    descricao: yup
        .string()
        .required("Informe a descrição")
        .min(5, "Descrição com no mínimo 5 caracteres")
        .max(50, "No máximo 50 caracteres"),

    tipo: yup
        .string()
        .oneOf([ 'ADULTO', 'INFANTIL' ], "Selecione ADULTO || INFANTIL")
        .required('Selecione ADULTO || INFANTIL'),

    modelagem: yup
        .string()
        .oneOf([ 'BASICA', 'BOXER', 'E30' ], "Selecione BASICA || BOXER || E30")
        .required('Selecione BASICA || BOXER || E30'),

    grade: yup
        .string()
        .oneOf([ 'P', 'M', 'G', 'GG', 'XGG' ], "Selecione P || M || G || GG || XGG")
        .required("Selecione P || M || G || GG || XGG"),

    barra: yup
        .string().default('0'),
})

type FormDataProps = {
    descricao: string;
    tipo: 'ADULTO' | 'INFANTIL';
    modelagem: 'BASICA' | 'BOXER' | 'E30';
    grade: 'P' | 'M' | 'G' | 'GG' | 'XGG';
    barra: string;
}

export default function NovoProduto() {

    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(schema),
    });

    const api = useAPI();
    const navigation = useNavigation<StackTypes>();

    async function handleCadastrar(data: FormDataProps) {
        try {
            const response = await api.post("/produto", {
                descricao: data.descricao,
                tipo: data.tipo,
                modelagem: data.modelagem,
                grade: data.grade,
                barra: data.barra
            });
            console.log(response.data);

            if (response.data) {
                toast.show({
                    description: 'Produto cadastrado com sucesso!',
                    placement: 'top',
                    bg: 'green.500',
                    fontSize: 'md'
                });
                navigation.goBack();
            }

        } catch (erro) {
            console.log(`**** ${erro}`);
            toast.show({
                description: 'Erro ao cadastrar produto!',
                placement: 'top',
                bg: 'red.500',
                fontSize: 'md'
            });
        }
    }

    return (
        <VStack flex={1} px={3}>
            <Center>
                <Heading />
                <Controller
                    control={control}
                    name='descricao'
                    render={({ field: { onChange } }) => (
                        <Input
                            placeholder="Descrição do produto"
                            onChangeText={onChange}
                            errorMessage={errors.descricao?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='tipo'
                    render={({ field: { onChange } }) => (
                        <Box
                            alignItems={'center'}
                            h={16}
                            w={'full'}
                            borderWidth={2}
                            borderColor={errors.tipo ? 'red.500' : 'gray.900'}
                            borderRadius={10}
                            justifyContent={'center'}
                        >
                            <Radio.Group
                                defaultValue="-1"
                                onChange={onChange}
                                name="radioGroupTipo"
                            >
                                <HStack space={'1/4'}>
                                    <Radio value="ADULTO" my={1} >
                                        Adulto
                                    </Radio>
                                    <Radio value="INFANTIL" my={1}>
                                        Infantil
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

                {/* ---------- */}

                <Controller
                    control={control}
                    name='modelagem'
                    render={({ field: { onChange } }) => (
                        <Box
                            mt={4}
                            alignItems={'center'}
                            h={16}
                            w={'full'}
                            borderWidth={2}
                            borderColor={errors.modelagem ? 'red.500' : 'gray.900'}
                            borderRadius={10}
                            justifyContent={'center'}
                        >
                            <Radio.Group
                                defaultValue="-1"
                                onChange={onChange}
                                name="radioGroupModelagem"
                            >
                                <HStack space={'1/6'}>
                                    <Radio value="BASICA" my={1} >
                                        Basica
                                    </Radio>
                                    <Radio value="BOXER" my={1}>
                                        Boxer
                                    </Radio>
                                    <Radio value="E30" my={1}>
                                        E30
                                    </Radio>
                                </HStack>
                            </Radio.Group>
                        </Box>
                    )}
                />
                {errors.modelagem && (
                    <Box alignSelf={'stretch'}>
                        <HStack mt={2} alignItems="center">
                            <WarningOutlineIcon size="xs" color="red.500" />
                            <Text
                                fontSize={12}
                                color="red.500"
                                ml={1}
                            >
                                {errors.modelagem.message}
                            </Text>
                        </HStack>
                    </Box>
                )}

                {/* ---------- */}

                <Controller
                    control={control}
                    name='grade'
                    render={({ field: { onChange } }) => (
                        <Box
                            mt={4}
                            alignItems={'center'}
                            h={16}
                            w={'full'}
                            borderWidth={2}
                            borderColor={errors.grade ? 'red.500' : 'gray.900'}
                            borderRadius={10}
                            justifyContent={'center'}
                        >
                            <Radio.Group
                                defaultValue="-1"
                                onChange={onChange}
                                name="radioGroupGrade"
                            >
                                <HStack space={'5'}>
                                    <Radio value="P" my={1} >
                                        P
                                    </Radio>
                                    <Radio value="M" my={1}>
                                        M
                                    </Radio>
                                    <Radio value="G" my={1}>
                                        G
                                    </Radio>
                                    <Radio value="GG" my={1}>
                                        GG
                                    </Radio>
                                    <Radio value="XGG" my={1}>
                                        XGG
                                    </Radio>
                                </HStack>
                            </Radio.Group>
                        </Box>
                    )}
                />
                {errors.grade && (
                    <Box alignSelf={'stretch'}>
                        <HStack mt={2} alignItems="center">
                            <WarningOutlineIcon size="xs" color="red.500" />
                            <Text
                                fontSize={12}
                                color="red.500"
                                ml={1}
                            >
                                {errors.grade.message}
                            </Text>
                        </HStack>
                    </Box>
                )}

                {/* ---------- */}

                <Controller
                    control={control}
                    name='barra'
                    render={({ field: { onChange } }) => (
                        <Input
                            mt={4}
                            placeholder="Código de barra (EAN13)"
                            onChangeText={onChange}
                            keyboardType="numeric"
                            errorMessage={errors.barra?.message}
                        />
                    )}
                />

                <Button
                    title='Salvar'
                    onPress={handleSubmit(handleCadastrar)}
                />
            </Center>
        </VStack>
    )
}
