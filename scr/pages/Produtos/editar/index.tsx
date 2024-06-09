import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../../routes';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";

import { Box, Center, HStack, Heading, Radio, Text, VStack, WarningOutlineIcon, useToast } from 'native-base';
import { Button } from '../../../componentes/Button';
import { Input } from '../../../componentes/Input';
import { useAPI } from '../../../service/API';

const schema = yup.object({
    descricao: yup
        .string().min(5, "Descrição com no mínimo 5 caracteres")
        .required("Informe a descrição"),

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

export default function EditarProduto({ route }) {

    const id = route.params.item.id;

    const [ descricao, setDescricao ] = useState('');
    const [ tipo, setTipo ] = useState('');
    const [ modelagem, setModelagem ] = useState('');
    const [ grade, setGrade ] = useState('');
    const [ barra, setBarra ] = useState('');

    const toast = useToast();

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(schema),
        defaultValues: {
            descricao: '',
            tipo: '',
            modelagem: '',
            grade: '',
            barra: ''
        }
    })

    useEffect(() => {
        if (!route.params)
            return;

        setValue('descricao', route.params.item.descricao);
        setValue('tipo', route.params.item.tipo);
        setValue('modelagem', route.params.item.modelagem);
        setValue('grade', route.params.item.grade);
        setValue('barra', route.params.item.barra);

    }, [ route.params.item, setValue ])

    const api = useAPI();

    const navigation = useNavigation<StackTypes>();

    async function handleAtualizar(data: FormDataProps) {

        try {
            const response = await api.put(`/produto?id=${id}`, {
                descricao: data.descricao,
                tipo: data.tipo,
                modelagem: data.modelagem,
                grade: data.grade,
                barra: data.barra
            })
            console.log(response.data);

            if (response.data) {
                toast.show({
                    description: 'Produto atualizado com sucesso!',
                    placement: 'top',
                    bg: 'green.500',
                    fontSize: 'md'
                })
            }

        } catch (erro) {
            console.log(`**** ${erro}`);
            toast.show({
                description: 'Erro ao atualizar o produto!',
                placement: 'top',
                bg: 'red.500',
                fontSize: 'md'
            })
        }
        finally {
            navigation.goBack();
        }
    }

    return (

        <VStack flex={1} px={5}>
            <Center>
                <Heading />
                <Controller
                    control={control}
                    name='descricao'
                    render={({ field: { onChange, value } }) => (
                        <Input
                            placeholder="Descrição do produto"
                            onChangeText={onChange}
                            value={value || descricao}
                            errorMessage={errors.descricao?.message}
                        />
                    )}
                />
                {/* -----------*/}

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
                        >
                            <Radio.Group
                                defaultValue="-1"
                                onChange={onChange}
                                value={value || tipo}
                                name="radioGroupTipo"
                            >
                                <HStack space={'1/4'}>
                                    {/* ADULTO || INFANTIL */}
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
                        <HStack mt={2} alignItems="center"
                        // mr={'10'}
                        >
                            <WarningOutlineIcon size="xs" color="red.500" />
                            <Text
                                fontSize={12}
                                color="red.500"
                                // textAlign="right"
                                ml={1}
                            //mr={12}
                            >
                                {errors.tipo.message}
                            </Text>
                        </HStack>
                    </Box>
                )}

                {/* ----------- */}

                <Controller
                    control={control}
                    name='modelagem'
                    render={({ field: { onChange, value } }) => (
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
                                value={value || modelagem}
                                name="radioGroupModelagem"
                            >
                                <HStack space={'1/6'}>
                                    {/* ADULTO || INFANTIL */}
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
                        <HStack mt={2} alignItems="center"
                        // mr={'10'}
                        >
                            <WarningOutlineIcon size="xs" color="red.500" />
                            <Text
                                fontSize={12}
                                color="red.500"
                                // textAlign="right"
                                ml={1}
                            //mr={12}
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
                    render={({ field: { onChange, value } }) => (
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
                                value={value || grade}
                                name="radioGroupGrade"
                            >
                                <HStack space={'5'}>
                                    {/* P || M || G || GG || XGG */}
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
                        <HStack mt={2} alignItems="center"
                        // mr={'10'}
                        >
                            <WarningOutlineIcon size="xs" color="red.500" />
                            <Text
                                fontSize={12}
                                color="red.500"
                                // textAlign="right"
                                ml={1}
                            //mr={12}
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
                    render={({ field: { onChange, value } }) => (
                        <Input
                            marginTop={4}
                            placeholder="Código de barra (EAN13)"
                            onChangeText={onChange}
                            value={value || barra}
                            keyboardType="numeric"
                            errorMessage={errors.barra?.message}
                        />
                    )}
                />

                <Button
                    title='Salvar'
                    onPress={handleSubmit(handleAtualizar)}
                />
            </Center>
        </VStack>
    )

}