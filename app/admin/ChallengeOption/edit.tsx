
import { SimpleForm, Create, TextInput, required, ReferenceField, ReferenceInput, NumberInput, SelectField, BooleanInput, Edit } from 'react-admin';

export const ChallengeOptionEdit = () => {
    return (

        <Edit>
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
        </Edit>

    )
};