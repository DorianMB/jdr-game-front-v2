interface CustomTableProps {
    columns: string[];
    data: [];
}

function CustomTable({columns, data}: CustomTableProps) {
    return (
        <table className="table table-bordered table-striped">
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column}>{column}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    {columns.map((column) => (
                        <td key={column}>{row[column]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default CustomTable;