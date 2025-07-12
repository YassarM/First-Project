
import React, { useEffect, useState } from 'react'
function Deadline() {

    const [backendData, setBackendData] = useState([{}]);
  
    useEffect(() => {
      fetch("/api").then(response => response.json()
      ).then(
        data => {
          setBackendData(data)
        }
      )
    }, []);
  
    return (
        <>
        <h1>Table Deadline</h1>
        <table>
            <thead>
                <tr>
                    <th>Deadline</th>
                    <th>Matkul</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Keterangan</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {!backendData ? (
          <p>Loading...</p>
        ) : (
          backendData.map((item) => (
            <tr className='row-table' key={item.id}>
              <td >{item.deadline}</td>
              <td >{item.matkul}</td>
              <td >{item.start}</td>
              <td >{item.end}</td>
              <td >{item.keterangan}</td>
              <td ><a href={item.link}>{item.link}</a></td>
            </tr>
          ))
        )}
            </tbody>
        </table>
        </>
    );
}

export default Deadline;