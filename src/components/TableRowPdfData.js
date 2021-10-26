import React from "react";
import "./TableRowPdfData.css";

const TableRowPdfData = ({ value }) => {
    return (
        <div id='content' style={{ "display": "none" }}>
            <div className='header'>리스트</div>
            <div className='container'>
                <table id='table'>
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>나이</th>
                        </tr>
                    </thead>
                    <tbody>
                        {value.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableRowPdfData;
