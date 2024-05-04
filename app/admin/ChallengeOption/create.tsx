
import { SimpleForm, Create, TextInput, required, ReferenceField, ReferenceInput, NumberInput, SelectField, BooleanInput } from 'react-admin';

export const ChallengeOptionCreate = () => {
    return (

        <Create>
            <SimpleForm>
                <TextInput source="text" validate={[required()]} label="text" />
                <BooleanInput
                source="correct"
                label="correct option"/>
                <ReferenceInput
                    source="challengeId"
                    reference="challenges" />
                <TextInput source="imageSrc" label="imageSrc" />
                <TextInput source="audioSrc" label="audioSrc" />

            </SimpleForm>
        </Create>

    )
};