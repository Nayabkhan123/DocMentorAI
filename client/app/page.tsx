'use-client'

import ChatComponent from "./components/chat";
import FileUploadComponent from "./components/file-uplaod";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar/>
      <div className="min-h-screen  w-screen flex ">
        <div className="min-w-[30vw] min-h-screen fixed overflow-y-hidden overflow-x-hidden">
          <FileUploadComponent/>
        </div>
        <div className="min-w-[70vw] absolute right-0 min-h-screen overflow-y-auto overflow-x-hidden">
          <ChatComponent/>
        </div>
      </div>
    </div>
  );
}
