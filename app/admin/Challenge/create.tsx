
import { SimpleForm, Create, TextInput, required, ReferenceField, ReferenceInput, NumberInput, SelectField, SelectInput } from 'react-admin';

export const ChallengeCreate = () => {
    return (

        <Create>
            <SimpleForm>
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
        </Create>

    )
};