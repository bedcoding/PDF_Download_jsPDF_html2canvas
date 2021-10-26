import React, { useState } from 'react';
import TableRowPdfData from './TableRowPdfData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "./PdfDownloader.css"

const PdfDownloader = () => {
    const [value, setValue] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");

    const generatePdf = async () => {
        try {
            const domElement = document.getElementById("content");  // "display": "none" 속성으로 PDF로 다운로드할 html 화면을 화면 어딘가에 숨겨놓는다.
            const canvas = await html2canvas(domElement, {
                onclone: function (clonedDoc) {
                    clonedDoc.getElementById('content').style.display = '';  // PDF로 다운로드할 html 화면을 복사할 때 display":''으로 스타일을 바꿔줘야 PDF 화면에 html 화면이 뜬다.
                }
            })
    
            // 위에서 캔버스로 만든 가상화면을 이미지로 변환한 뒤 PDF 저장 (그냥 저장시 한글깨짐)
            const imgData = canvas.toDataURL("image/jpeg");
            const pageWidth = 210; // 가로 길이 a4 기준
            const pageHeight = pageWidth * 1.414; // 출력 페이지 세로길이
            const imgWidth = pageWidth - 20;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            const doc = new jsPDF("p", "mm", [pageHeight, pageWidth]);
            doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // 한 페이지 이상일 경우 루프 돌면서 출력
            while (heightLeft >= 20) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            doc.save("화면.pdf");

            // // 위에서 캔버스로 만든 가상화면을 이미지로 변환해준 => PDF 저장
            // const imgData = await canvas.toDataURL("image/png");
            // const pdf = new jsPDF("p","mm",[pageHeight, pageWidth]);
            // pdf.addImage(imgData, "JPEG", 10, 10);  // 참고: 만약 imgData 캔버스 크기가 0이면 오류 발생함
            // pdf.save(`${new Date().toISOString()}.pdf`); 
        } catch (error) {
            console.log(error);
        }
    }

    const handleDownload = (e) => {
        e.preventDefault();
        generatePdf();
    }
    
    const handleChange = (e) => {
        const data = e.target.value;
        e.target.placeholder === 'Name' ? setName(data) : setAge(data);
    }

    const handleClick = () => {
        const entry = { name, age };
        setValue([
            ...value,
            entry,
        ]);
    }

    return (
        <>
            <div className='container'>
                <form onSubmit={handleDownload} className='form'>
                    <div className='inputContainer'>
                        <input type='text' placeholder='Name' value={name} onChange={handleChange} />
                        <input type='number' placeholder='Age' value={age} onChange={handleChange} />
                        <button type='button' onClick={handleClick} disabled={!name && !age}>Add</button>
                    </div>

                    <button onClick={handleClick}>Download PDF</button>
                </form>
            </div>

            <TableRowPdfData value={value} />
        </>
    )
}

export default PdfDownloader;
