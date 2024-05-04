
import { SimpleForm, Create, TextInput, required, ReferenceField, ReferenceInput, NumberInput, Edit } from 'react-admin';

export const LessonEdit = () => {
    return (

        <Edit>
            <SimpleForm>
            <NumberInput source="id"
                 validate={[required()]} label="id" />
                <TextInput source="title" validate={[required()]} label="Title" />
                <ReferenceInput
                    source="unitId"
                    reference="units" />
                <NumberInput source="unitId"
                 validate={[required()]} label="order" />

            </SimpleForm>
        </Edit>

    )
};