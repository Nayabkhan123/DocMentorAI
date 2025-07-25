import React from 'react'
import Navbar from '../components/Navbar';
import FileUploadComponent from '../components/file-uplaod';
import ChatComponent from '../components/chat';

const page = () => {
  return (
    <div className="overflow-x-hidden ">
      <div className=''>
        <Navbar/>
      </div>
      <div className="min-h-screen w-screen flex flex-col md:flex-row">
        <div className="md:w-[30vw] md:h-screen mt-16 py-4 overflow-y-hidden overflow-x-hidden">
          <FileUploadComponent/>
        </div>
        <div className="w-full md:w-[70vw] md:mt-8 h-screen overflow-y-scroll overflow-x-hidden">
          <ChatComponent/>
        </div>
      </div>
    </div>
  );
}

export default page