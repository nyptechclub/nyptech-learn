
import { SimpleForm, Create, TextInput, required, ReferenceField, ReferenceInput, NumberInput, Edit } from 'react-admin';

export const UnitEdit = () => {
    return (

        <Edit>
            <SimpleForm>
            <NumberInput source="id"
                 validate={[required()]} label="id" />
                <TextInput source="title" validate={[required()]} label="Title" />
                <TextInput source="description" validate={[required()]} label="image" />
                <ReferenceInput
                    source="courseId"
                    reference="courses" />
                <NumberInput source="courseId"
                 validate={[required()]} label="order" />

            </SimpleForm>
        </Edit>

    )
};