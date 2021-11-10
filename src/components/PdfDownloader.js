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
                scale: 1,  // 브라우저 화면을 확대하면 html도 커진 채로 캔버스에 저장되서 A4 용지를 초과해버리니 오리지날 형태를 고정시킨다.
                onclone: function (clonedDoc) {
                    clonedDoc.getElementById('content').style.display = '';  // onClone: 원본 소스 문서에 영향을 주지 않고 PDF 내용을 수정하는데 사용 (display":''으로 스타일을 바꿔줘야 PDF 화면에 html 화면이 뜬다)
                }
            })
    
            // 1. html을 이미지로 바꾸기 (1.0: 최고화질)
            const imgData = canvas.toDataURL("image/png", 1.0);

            // 2. PDF 출력페이지 크기 설정후 공간 생성
            const pageWidth = 210; // 가로 길이 a4 기준
            const pageHeight = pageWidth * 1.414; // 출력 페이지 세로길이
            const imgWidth = pageWidth - 20;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const doc = new jsPDF("p", "mm", [pageHeight, pageWidth]);

            // 3. PDF 출력페이지에 이미지로 바꾼 html 넣기
            let x = 0;
            let y = 0;
            doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

            // 4. 한 페이지 이상일 경우 루프 돌면서 출력
            let heightLeft = imgHeight;
            heightLeft -= pageHeight;

            while (heightLeft >= 20) {
                y = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, "JPEG", 0, y, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            doc.save("화면.pdf");
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
