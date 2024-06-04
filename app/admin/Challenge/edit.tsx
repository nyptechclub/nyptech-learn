
import { SimpleForm, Create, TextInput, required, ReferenceField, ReferenceInput, NumberInput, Edit, SelectField, SelectInput } from 'react-admin';

export const ChallengeEdit = () => {
    return (

        <Edit>
            <SimpleForm>
            <NumberInput source="id"
                 validate={[required()]} label="id" />
                <TextInput source="question" validate={[required()]} label="question" />
                <SelectInput
        source="type"
        choices={[
            {
            id: "SELECT",
            name: "SELECT"
        },
        {
            id: "ASSIST",
            name: "ASSIST"
        }
    ]}
    validate={[required()]}

        />
        <TextInput source="lesson" label="lesson" />
                <ReferenceInput
                    source="lessonId"
                    reference="lessons" />
                <NumberInput source="order"
                 validate={[required()]} label="order" />

            </SimpleForm>
        </Edit>

    )
};