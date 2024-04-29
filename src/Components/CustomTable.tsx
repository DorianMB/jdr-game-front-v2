import {RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiEyeLine, RiSaveFill} from "@remixicon/react";
import React, {useEffect, useState} from "react";
import {ConfigTable} from "../utils/config.tables.ts";

interface CustomTableProps {
    name: string;
    config: ConfigTable;
    data: any[];
    postMethod: (data: any) => Promise<any>;
    patchMethod: (data: any) => Promise<any>;
    deleteMethod: (data: any) => Promise<any>;
    refreshData: () => void;
}

function CustomTable({
                         name,
                         config,
                         data,
                         postMethod,
                         patchMethod,
                         deleteMethod,
                         refreshData
                     }: CustomTableProps) {
    const [isEdit, setIsEdit] = useState<boolean[]>([]);
    const [editData, setEditData] = useState<Record<string, string | number>>({});

    useEffect(() => {
        setIsEdit(new Array(data.length).fill(false));
    }, []);

    const findOption = (option: {
        value: string | number,
        label: string
    }, row: Record<string, string | number>, column: string): string => {
        if (option.value == row[column]) {
            return option.label;
        } else {
            return '';
        }
    }

    const handleEdit = async (key: number, value: boolean) => {
        if (value) {
            setEditData(data[key]);
        } else {
            if (data[key].isNew) {
                delete editData.isNew;
                const res = await postMethod(editData);
                data[key] = {...res};
            } else {
                const res = await patchMethod(editData);
                data[key] = {...res};
            }
        }
        setIsEdit((prev) => {
            const copy = [...prev];
            copy[key] = value;
            return copy;
        });
    }

    const handleDelete = async (row: any) => {
        if (confirm(`Supprimer cet élément ? (${name})`)) {
            await deleteMethod(row);
            refreshData();
        }
    }

    const addElement = () => {
        const newData: any = {...config.defaultData};
        Object.keys(newData).forEach((key) => {
            newData[key] = '';
        });
        newData.isNew = 1;
        data.push(newData);
        setIsEdit((prev) => {
            const copy = [...prev];
            copy.push(true);
            return copy;
        });
        setEditData({isNew: 1});
    }

    return (
        <>
            {
                config.canAdd &&
                <button className="btn btn-success float-end m-3" onClick={addElement}><RiAddLine></RiAddLine> {name}
                </button>
            }
            <table className="table table-bordered table-striped text-center custom-table">
                <thead>
                <tr>
                    {config.columnsKeys.map((column) => (
                        <th key={'head-' + column} className="th-200">{column}</th>
                    ))}
                    {
                        config.actions &&
                        <th className="th-200">Actions</th>
                    }
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={'row-' + index}>
                        {config.columnsKeys.map((column, indexCol) => (
                            <React.Fragment key={'rf-col-' + indexCol}>
                                {
                                    isEdit[index] &&
                                    <td key={'col-' + indexCol}>
                                        <div className="d-flex justify-content-center align-items-center">
                                            {
                                                config.columsTypes[indexCol] === 'number' &&
                                                <input type="number" className="form-control"
                                                       onChange={(e) => {
                                                           setEditData({...editData, [column]: e.target.value})
                                                       }}
                                                       defaultValue={editData[column]}/>
                                            }
                                            {
                                                config.columsTypes[indexCol] === 'string' &&
                                                <input type="text" className="form-control"
                                                       onChange={(e) => {
                                                           setEditData({...editData, [column]: e.target.value})
                                                       }}
                                                       defaultValue={editData[column]}/>
                                            }
                                            {
                                                config.columsTypes[indexCol] === 'select' &&
                                                <select className="form-select"
                                                        defaultValue={editData[column] ? editData[column] : ''}
                                                        onChange={(e) => {
                                                            setEditData({...editData, [column]: e.target.value})
                                                        }}>
                                                    {
                                                        config.selectOptions &&
                                                        config.selectOptions[column].map((option, key) => (
                                                            <option value={option.value}
                                                                    key={'option-' + key}>
                                                                {option.label}
                                                            </option>
                                                        ))
                                                    }
                                                    <option value={''}>-</option>
                                                </select>
                                            }
                                        </div>
                                    </td>
                                }
                                {
                                    !isEdit[index] &&
                                    <td key={'col-' + indexCol}>
                                        <div className="d-flex justify-content-center align-items-center">
                                            {config.columsTypes[indexCol] !== 'select' ? row[column] :
                                                (config.selectOptions![column].find((option) => findOption(option, row, column))?.label || row[column])
                                            }
                                        </div>
                                    </td>
                                }
                            </React.Fragment>
                        ))}
                        {
                            config.actions &&
                            <td>
                                <div className="d-flex justify-content-center align-items-center">
                                    {!isEdit[index] && config.actions.map((action, actionkey) => (
                                        <React.Fragment key={'rf-action-' + actionkey}>
                                            {
                                                action === 'Edit' &&
                                                <button key={'action-' + actionkey}
                                                        className="btn text-white mx-2 btn-info"
                                                        onClick={() => handleEdit(index, true)}>
                                                    <RiEdit2Line/>
                                                </button>
                                            }
                                            {
                                                action === 'Delete' &&
                                                <button key={'action-' + actionkey}
                                                        onClick={() => handleDelete(row)}
                                                        className="btn text-white mx-2 btn-danger">
                                                    <RiDeleteBin6Line/>
                                                </button>
                                            }
                                            {
                                                action === 'View' &&
                                                <button key={'action-' + actionkey}
                                                        className="btn text-white mx-2 btn-primary">
                                                    <RiEyeLine/>
                                                </button>
                                            }
                                        </React.Fragment>
                                    ))}
                                    {
                                        isEdit[index] &&
                                        <button className="btn text-white mx-2 btn-success"
                                                onClick={() => handleEdit(index, false)}>
                                            <RiSaveFill/>
                                        </button>
                                    }
                                </div>
                            </td>
                        }
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default CustomTable;