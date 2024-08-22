"use client"

import { useEffect, useState } from "react";
import {DragDropContext, Draggable, DropResult, Droppable} from "@hello-pangea/dnd"
import { cn } from "@/lib/utils";
import { Grid, Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { chapters } from "@prisma/client";
interface Props{
    items: chapters[];
    onReorder: (updateData:{
        id: string;
        position: number
    }[]) => void;
    onEdit:(id: string) => void
}
const ChapterList = ({
items,
onReorder,
onEdit
}: Props) => {
    const [isMounted, setisMounted] = useState(false)
    const [chapters, setchapters] = useState(items)
    useEffect(()=>{
        setisMounted(true)
    }, [])
    useEffect(()=>{
        setchapters(items)
    }, [items])
    const onDragEnd = (result: DropResult)=> {
        if(!result.destination) return 
        const items = Array.from(chapters)
        const [reordereditem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reordereditem)
        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)
        const updatedchapters = items.slice(startIndex, endIndex + 1)
        setchapters(items)
        const bulkupdatedata = updatedchapters.map((chapter)=> ({
            id: chapter.id.toString(),
            position: items.findIndex((item)=> item.id.toString() === chapter.id.toString())
        }))
        onReorder(bulkupdatedata)
    }
    if(!isMounted){
        return null
    }
    return ( 
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
            {(provided)=>(
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {chapters.map((chapter, index) =>(
                        <Draggable key={chapter.id.toString()} draggableId={chapter.id.toString()} index={index}>
                            {(provided)=> (
                                <div className="flex items-center gap-x-2 rounded-md mb-4 text-sm bg-base-200"
                                ref={provided.innerRef}{...provided.draggableProps}>
                                    <div className="px-2 py-3 border-r  rounded-l-md transition"
                                    {...provided.dragHandleProps}>
                                        <Grip/>
                                    </div>
                                    {chapter.title?.toString()}
                                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                                    <Badge>
                                    {chapter.is_published ? "Published": "Draft"}
                                    </Badge>
                                    <Pencil onClick={()=> onEdit(chapter.id.toString())} className="w-4 h-4 cursor-pointer transition"/>
                                    </div>

                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
        </DragDropContext>
     );
}
 
export default ChapterList;