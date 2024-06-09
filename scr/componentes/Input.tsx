/* eslint-disable */
import { Input as NativeBaseInput, IInputProps, FormControl, WarningOutlineIcon } from "native-base";

type Props = IInputProps & {
    errorMessage?: string | null;
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {

    const invalid = !!errorMessage || isInvalid

    return (
        <FormControl mb={4} isInvalid={invalid}>

            <NativeBaseInput
                fontSize={16}
                h={16}
                borderRadius={10}
                isInvalid={invalid}
                borderWidth={2}
                borderColor={'gray.900'}
                placeholderTextColor="gray.500"

                _focus={{
                    bg: "gray.200",
                    borderWidth: 2,
                    borderColor: "blue.500",
                }}

                _invalid={{
                    borderWidth: 2,
                    borderColor: "red.500"
                }}

                {...rest}
            />

            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errorMessage}
            </FormControl.ErrorMessage>

        </FormControl>
    )
}