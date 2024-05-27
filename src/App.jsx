// src/App.js
import  { useState } from 'react';
import { useEffect } from 'react';
import Editor from './Editor';

const linkClass = " text-white hover:text-gray-300 font-semibold";
const listItemClass = "flex space-x-4 ";
const serverUrl='https://pocserver.onrender.com';
const App = () => {

  const [files, setFiles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(serverUrl+'/userinfo', {
          credentials: 'include', // Include cookies in request
        });
        if (response.status === 401) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking authentication', error);
        setIsLoggedIn(false);
      }
    };
    checkAuthentication();
  }, []);
  const handleAuth = () => {
    window.location.href = serverUrl+'/auth';
  };
  const handleSignOut = async () => {
    try {
      const response = await fetch(serverUrl+'/signout', {
        credentials: 'include',
        headers: {
          'Access-Control-Allow-Origin': serverUrl+''
        }

      });
      console.log(response.json)
      if (response.status == 200) {
        setIsLoggedIn(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error signing out', error);
    }

  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(serverUrl+'/files?id=' + documentId, {
        credentials: 'include', // Include cookies in request
      });

      if (response.status === 401) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        const filesResponse = await response.json();
        console.log(filesResponse)
        setFiles(filesResponse);
      }
    } catch (error) {
      console.error('Error checking authentication', error);
      setIsLoggedIn(false);
    }
  };


  return (
    <div>

      <nav className=" border border-gray-700 sticky top-3 bg-gray-900 bg-opacity-10 backdrop-filter backdrop-blur-sm text-white p-4 px-6 flex justify-between items-center w-4/5 rounded-lg mt-3 m-auto">
        <div>
          <a href="#" className="font-bold text-lg">DocPreview</a>
        </div>
        <ul className={listItemClass}>
          {isLoggedIn ? (
            <button className={linkClass} onClick={handleSignOut}>Log Out</button>
          ) : (
            <button className={linkClass} onClick={handleAuth}>Log in</button>
          )}
        </ul>
      </nav>

      <div className='w-4/5 m-auto mt-5'>
        {/* <form className="max-w-md p-4">
        <label htmlFor="document-id" className="block text-gray-200">Document ID</label>
        <input onKeyUp={(e) => setDocumentId(e.target.value)} id="document-id" type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" placeholder="Enter Document ID" />
        <button onClick={(e) => { e.preventDefault(); handleGetFiles(documentId) }} type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">Submit</button>
      </form> */}
        <h1 className="text-2xl text-white font-bold my-5">Enter Document ID</h1>
        <div className=" border border-gray-700 bg-gray-900 bg-opacity-10 backdrop-filter backdrop-blur-sm p-4 rounded-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <label className="text-white ">Document ID</label>
            <input
              type="text"
              id="document"
              className={`border-white  text-white  bg-transparent border py-2 px-4 rounded-md hover:bg-gray-900  hover:text-white  transition duration-300`}
              placeholder="Enter Document ID"
              value={documentId}
              onInput={(e) => setDocumentId(e.target.value)}
            />
            <button type="submit" className={`border-white text-white  bg-transparent border p-2 focus:outline-none focus:border-zinc-500`}>
              Submit
            </button>
          </form>

        </div>
      </div>

      {files  &&
      <>
       <Editor data={files.data}/>
       <div className='w-2/4 p-3 bg-white m-auto' dangerouslySetInnerHTML={{__html:files.data}}></div>
      </>
       
      }
    </div>
  );
};
export default App;




