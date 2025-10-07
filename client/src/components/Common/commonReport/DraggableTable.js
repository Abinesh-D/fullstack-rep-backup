import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableTableRow from './DraggableTableRow';

const DraggableTable = ({ data, columns, setData }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = [...data];
        const [removed] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, removed);
        setData(items);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <table className="border table-auto w-full text-sm text-left">
                <thead>
                    <tr className="bg-gray-100 text-xs text-gray-700 uppercase">
                        {columns.map((col) => (
                            <th key={col.accessorKey} className="px-4 py-2">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <Droppable droppableId="table-body" type="TABLE" direction="vertical">
                    {(provided) => (
                        <tbody ref={provided.innerRef} {...provided.droppableProps}>
                            {data.map((row, index) => (
                                <DraggableTableRow key={row._id} row={row} index={index}>
                                    {columns?.map((col, colIndex) => (
                                        <td key={colIndex} style={{ backgroundColor: row.nplId === true ? "antiquewhite" : "#fafecf" }} className="px-3 py-2">
                                            {col.header === 'S. No.'
                                                ? index + 1
                                                : col.cell
                                                    ? col.cell({ row }) || "-"
                                                    : row[col.accessorKey] !== undefined && row[col.accessorKey] !== null && row[col.accessorKey] !== ""
                                                        ? row[col.accessorKey]
                                                        : "-"
                                            }
                                        </td>
                                    ))}
                                </DraggableTableRow>
                            ))}
                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>
        </DragDropContext>
    );
};

export default DraggableTable;
