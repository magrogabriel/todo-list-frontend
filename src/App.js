import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdatind, setIsUpdating] = useState('');
  const [isAdding, setIsAdding] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');

  //Creating function to fetch all todo items from database -- useEffect hook
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('https://todo-list-app-api.onrender.com/api/items')
        setListItems(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getItemsList()
    console.log(isAdding ? 'true' : 'false')
  }, [])


  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://todo-list-app-api.onrender.com/api/item', { item: itemText })
      setListItems(prev => [...prev, res.data]);
      setItemText('');
      setIsAdding('');
    } catch (err) {
      console.log(err);
    }
  }


  //Add item input render
  const addItemInput = () => (
    <form className="form" onSubmit={e => addItem(e)}>
      <input type="text" placeholder="Add Todo Item" onChange={e => setItemText(e.target.value)} value={itemText} />
      <button type="submit"><i className="bi bi-plus-lg"></i> Add</button>
    </form>
  )

  //Update item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => { updateItem(e) }}>
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e => setUpdateItemText(e.target.value)} value={updateItemText}></input>
      <button className="update-new-btn" type="submit"><i className="bi bi-pen"></i> Update</button>
    </form>
  )

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://todo-list-app-api.onrender.com/api/item/${isUpdatind}`, { item: updateItemText })
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdatind);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  }

  //Deleting items when click on delete
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`https://todo-list-app-api.onrender.com/api/item/${id}`)
      const newListItems = listItems.filter(item => item._id !== id);
      setListItems(newListItems)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <h1 className="title">Welcome.</h1>
      <p className="subtitle">Here's your to-do list:</p>
      {isAdding
        ? addItemInput()
        : <div className="add-item-content">
            <button className="add-link" onClick={() => setIsAdding('a')}>
            <div className="empty-box"></div> <p>Add an item</p>
            </button>
        </div>}

      <div className="todo-listItems">
        {listItems.map(item =>
          <div key={item._id} className="todo-item">
            {
              isUpdatind === item._id
                ? renderUpdateForm()
                : <div key={item._id} className="item-box">
                    <div className="item-content-text">
                    <div className="empty-box"></div> <p className="item-content">{item.item}</p>
                  </div>
                  <div className="item-content-btns">
                    <button className="update-item" onClick={() => { setIsUpdating(item._id) }}><i className="bi bi-pen"></i> Update</button>
                    <button className="delete-item" onClick={() => deleteItem(item._id)}><i className="bi bi-trash3"></i> Delete</button>
                  </div>
                </div>
            }
          </div>
        )}


      </div>
    </div>
  );
}

export default App;
