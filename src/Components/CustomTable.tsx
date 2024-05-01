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
    const [dataToShow, setDataToShow] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        setIsEdit(new Array(data.length).fill(false));
        OrderData();
    }, []);

    const OrderData = () => {
        return data.sort((a, b) => {
            if (a.updated_at > b.updated_at) {
                return -1;
            }
            if (a.updated_at < b.updated_at) {
                return 1;
            }
            return 0;
        });
    }

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
                refreshData();
            } else {
                const res = await patchMethod(editData);
                data[key] = {...res};
                refreshData();
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
                <div className="d-flex justify-content-end">
                    <button className="btn btn-success m-3" onClick={addElement}>
                        <RiAddLine></RiAddLine> {name}
                    </button>
                </div>
            }
            {/*TABLE*/}
            <div className="custom-table-container">
                <table className="table table-bordered table-striped w-100 text-center">
                    <thead>
                    <tr>
                        {config.columnsKeys.map((column, indexCol) => (
                            <React.Fragment key={'rf-th-' + column}>
                                {
                                    config.columsTypes[indexCol] === 'number' &&
                                    <th key={'head-' + column} className="th-auto">{column}</th>
                                }
                                {
                                    config.columsTypes[indexCol] === 'string' &&
                                    <th key={'head-' + column} className="th-auto">{column}</th>
                                }
                                {
                                    config.columsTypes[indexCol] === 'date' &&
                                    <th key={'head-' + column} className="th-auto">{column}</th>
                                }
                                {
                                    config.columsTypes[indexCol] === 'textaera' &&
                                    <th key={'head-' + column} className="th-500">{column}</th>
                                }
                                {
                                    config.columsTypes[indexCol] === 'url' &&
                                    <th key={'head-' + column} className="th-500">{column}</th>
                                }
                                {
                                    config.columsTypes[indexCol] === 'select' &&
                                    <th key={'head-' + column} className="th-auto">{column}</th>
                                }
                            </React.Fragment>
                        ))}
                        {
                            config.actions &&
                            <th className="th-auto">Actions</th>
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
                                                           disabled={config.isDisabled && config.isDisabled.includes(column)}
                                                           defaultValue={editData[column]}/>
                                                }
                                                {
                                                    (config.columsTypes[indexCol] === 'string' || config.columsTypes[indexCol] === 'url') &&
                                                    <input type="text" className="form-control"
                                                           onChange={(e) => {
                                                               setEditData({...editData, [column]: e.target.value})
                                                           }}
                                                           disabled={config.isDisabled && config.isDisabled.includes(column)}
                                                           defaultValue={editData[column]}/>
                                                }
                                                {
                                                    config.columsTypes[indexCol] === 'textaera' &&
                                                    <textarea className="form-control"
                                                              onChange={(e) => {
                                                                  setEditData({...editData, [column]: e.target.value})
                                                              }}
                                                              disabled={config.isDisabled && config.isDisabled.includes(column)}
                                                              defaultValue={editData[column]}/>
                                                }
                                                {
                                                    config.columsTypes[indexCol] === 'date' &&
                                                    <input type="text" className="form-control"
                                                           disabled
                                                           defaultValue={editData[column]}/>
                                                }
                                                {
                                                    config.columsTypes[indexCol] === 'select' &&
                                                    <select className="form-select"
                                                            disabled={config.isDisabled && config.isDisabled.includes(column)}
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
                                                {config.columsTypes[indexCol] === 'select' &&
                                                    <span>{(config.selectOptions![column].find((option) => findOption(option, row, column))?.label ||
                                                        row[column])}</span>
                                                }
                                                {config.columsTypes[indexCol] === 'date' &&
                                                    <span>{new Date(row[column]).toLocaleDateString() + ' ' + new Date(row[column]).toLocaleTimeString()}</span>
                                                }
                                                {config.columsTypes[indexCol] !== 'select' && config.columsTypes[indexCol] !== 'date' &&
                                                    <span>{row[column]}</span>
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
                                                            onClick={() => setDataToShow(row)}
                                                            data-bs-toggle="modal"
                                                            data-bs-target={'#modalDetails-' + name}
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
            </div>

            {/* MODAL */}
            <div className="modal modal-detail fade" id={'modalDetails-' + name} tabIndex={-1}
                 aria-labelledby={'modalDetailsLabel-' + name}
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={'modalDetailsLabel-' + name}>Détail</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                config.columnsKeys.map((column, index) => (
                                    <div key={'modal-' + index}
                                         className="d-flex flex-column align-items-center justify-content-center">
                                        {config.columsTypes[index] === 'select' &&
                                            <span>{column} : {(config.selectOptions![column].find((option) => findOption(option, dataToShow, column))?.label ||
                                                dataToShow[column])}</span>
                                        }
                                        {config.columsTypes[index] === 'date' &&
                                            <span>{column} : {new Date(dataToShow[column]).toLocaleDateString() + ' ' + new Date(dataToShow[column]).toLocaleTimeString()}</span>
                                        }
                                        {config.columsTypes[index] === 'url' &&
                                            <img className="img-fluid" src={dataToShow[column]}
                                                 alt={dataToShow[column]}/>
                                        }
                                        {config.columsTypes[index] !== 'select' && config.columsTypes[index] !== 'date' && config.columsTypes[index] !== 'url' &&
                                            <span>{column} : {dataToShow[column]}</span>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CustomTable;