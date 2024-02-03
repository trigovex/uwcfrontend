import React, { useState,useEffect } from 'react';
import { deleteData, getData, postData, putData } from '../helpers/APiCalling';
import "./Expenses.css" 

const Expenses = () => {
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refresh,setrefresh] =useState();
  const totalAmount = records.reduce((sum, record) => sum + parseFloat(record.Amount), 0);

   const handleAddRecord =async () => {
    const newRecord = {
      
     Amount: amount,
      Description:description,
      
    };
    const response = await postData('/expenses/create', newRecord); 
    if(response){
      let date =new Date()
      setrefresh(date)
       alert("record added...")
      setRecords([...records, newRecord]);
      setAmount('');
      setDescription('');
    }
    
  };

const handleEditRecord = (record) => {
    setIsEditing(true);
    setAmount(record.Amount);
    setDescription(record.Description);
    setSelectedRecord(record);
  };


   const Get=async()=>{
              let resp = await getData("/expenses",{},{})
              console.log(resp)
              setRecords(resp)
   }

      useEffect(()=>{
          Get()
      },[refresh])
  

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleDeleteRecord = async(id) => {
 
    const response = await deleteData('/expenses/delete/'+id); 

    if(response){
    
      let date =new Date()     
       setrefresh(date)
      alert("delete successfully...")
    }
  };

  return (

    <div className="app-container">
      <div className="form-container glass-morphism">
      <h2>Manage Your Expenses</h2>
      <div className='top-information'>
      </div>

        <div>
          <label>Items Purchased:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        
        
          <button onClick={handleAddRecord}>Add</button>
        
      </div>
      <h2 style={{textAlign:"center"}}>History</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>SNO</th>
              <th>Description</th>
              <th>Amount</th>
              <th>CreatedAt</th>
              <th>UpdatedAt</th>
              <th>View</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((record, index) => (
              <Row setrefresh={setrefresh} handleViewRecord={handleViewRecord} handleEditRecord={handleEditRecord} handleDeleteRecord={handleDeleteRecord} record={record} index={index}/>
            ))}
          </tbody>
        </table>
      </div>
      <div>
      <h2>Total Expenses: {totalAmount}</h2>
      </div>

      {selectedRecord && (
        <div className="popup">
          <div className="popup-content">
            
            <h2>Record Details</h2>
            <p>Amount: {selectedRecord.Amount}</p>
            <p>Description: {selectedRecord.Description}</p>
            <p>CreatedAt: {selectedRecord.Created_At}</p>
            <p>UpdatedAt: {selectedRecord.Updated_At || '-'}</p>
              <button style={{textAlign:'left'}}  onClick={() => setSelectedRecord(null)}> Close</button>
          </div>
         
        </div>
      )}
    </div>
  );
};

function Row({handleViewRecord,handleEditRecord,handleDeleteRecord,record,index,setrefresh}){
 const [isEditing, setIsEditing] = useState(false);
   const [amount, setAmount] = useState(record?.Amount);
  const [description, setDescription] = useState(record?.Description);
 
 
  const edit=async(item)=>{
      setIsEditing(true)
  }


  const handleSaveRecord = async (data) => {
    const update = {
      Amount: amount,
      Description: description,
    };

    const response = await putData('/expenses/update/' + data?.Id, update);

    
      alert("update successfully")
       let date =new Date()     
       setrefresh(date)
      setIsEditing(false);
    
  };


  return(
     <tr key={record.Id}>
                <td>{index + 1}</td>
                {!isEditing?<>
                   <td>{record.Description}</td>
                <td>{record.Amount}</td>
                </>:

                 <>
                   <td>

                    <input value={description} onChange={(e)=>setDescription(e.target.value)}/>
                  </td>
                   <td>  

                     <input value={amount}  onChange={(e)=>setAmount(e.target.value)}/>
                   </td>
                 </>

                }
                <td>{record.Created_At}</td>
                <td>{record.Updated_At || '-'}</td>
                <td>
                  <span
                    className="action-icon"
                    onClick={() => handleViewRecord(record)}
                  >
                    👁️
                  </span>
                 
                </td>
                 <td>
                   {!isEditing?
                   <span
                    className="action-icon"
                    onClick={() => edit(record)}
                  >
                    ✏️
                  </span>:
                   <button onClick={()=>handleSaveRecord(record)}>save</button>
                   }
                  
                </td>
                <td>
                 
                  <span
                    className="action-icon"
                    onClick={() => handleDeleteRecord(record.Id)}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
  )
}

export default Expenses;
