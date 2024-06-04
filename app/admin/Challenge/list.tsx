
import { Datagrid, List, ReferenceField, SelectField, TextField } from 'react-admin';

export const ChallengeList = () => {
    return(
        <div  className='w-full max-w-96'>
<List>
    <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="question" />
        <SelectField
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
        />
        <TextField source="lesson"/>
        <ReferenceField source="lessonId" reference="lessons"/>
        <TextField source="order" />
    </Datagrid>
</List>

        </div>
    
    )
};