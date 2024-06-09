/* eslint-disable */
import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
    title: string;
};

export function Button({ title, ...rest }: Props) {
    return (
        <ButtonNativeBase
            w={'full'}
            h={16}
            bg={'blue.600'}
            borderRadius={10}
            _pressed={{
                bg: 'blue.400',
            }}
            {...rest}>
            <Text color={'#FFF'} fontSize={20}>
                {title}
            </Text>
        </ButtonNativeBase>
    );
}
