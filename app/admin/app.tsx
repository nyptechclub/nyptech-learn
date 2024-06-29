"use client"
import { Admin, ListGuesser, Resource } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"
import { CourseList } from "./Course/list"
import { CourseCreate } from "./Course/create"
import { CourseEdit } from "./Course/edit"
import { UnitList } from "./Unit/list"
import { UnitCreate } from "./Unit/create"
import { UnitEdit } from "./Unit/edit"
import { LessonList } from "./Lesson/list"
import { LessonCreate } from "./Lesson/create"
import { LessonEdit } from "./Lesson/edit"
import { ChallengeList } from "./Challenge/list"
import { ChallengeCreate } from "./Challenge/create"
import { ChallengeEdit } from "./Challenge/edit"
import { ChallengeOptionList } from "./ChallengeOption/list"
import { ChallengeOptionCreate } from "./ChallengeOption/create"
import { ChallengeOptionEdit } from "./ChallengeOption/edit"
import Link from "next/link"
const dataProvider = simpleRestProvider("/api")
const AdminApp = () => {
    return (
        <div>
            <Link href={"/learn"} className="btn">
                Learn Page
            </Link>
            <Admin dataProvider={dataProvider}>

                <Resource
                    name="courses"
                    recordRepresentation="title"
                    list={CourseList}
                    create={CourseCreate}
                    edit={CourseEdit} />
                <Resource
                    name="units"
                    recordRepresentation="title"
                    list={UnitList}
                    create={UnitCreate}
                    edit={UnitEdit} />
                <Resource
                    name="lessons"
                    recordRepresentation="title"
                    list={LessonList}
                    create={LessonCreate}
                    edit={LessonEdit} />
                <Resource
                    name="challenges"
                    recordRepresentation="question"
                    list={ChallengeList}
                    create={ChallengeCreate}
                    edit={ChallengeEdit} />
                <Resource
                    name="challengeOptions"
                    recordRepresentation="options"
                    list={ChallengeOptionList}
                    create={ChallengeOptionCreate}
                    edit={ChallengeOptionEdit} />
            </Admin>
        </div>
    );
}

export default AdminApp;