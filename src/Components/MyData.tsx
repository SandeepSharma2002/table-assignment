import {
  MRT_PaginationState,
  MRT_RowSelectionState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect } from "react";
import userData from "../Services/MyData";
import { useMemo, useState } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "./EditUser";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";

export const MyData = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [update, setUpdate] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState<MRT_PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [addId, setAddId] = useState<string>("");
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [initialData, setInitialData] = useState<any>([]);
  const [mode, setMode] = useState<any>("");

  const globalTheme = useTheme();

  useEffect(() => {
    const skip = paginationModel.pageIndex * paginationModel.pageSize;
    const limit = paginationModel.pageSize + skip;
    userData.getUsers().then((res: any) => {
      setAddId(`${res.length + 1}`);
      localStorage.setItem("Users", JSON.stringify(res));
      setInitialData(res?.slice(skip, limit));
      setTotalRows(res.length);
      setLoading(false);
    });
  }, []);
 console.log(editId);
  const getdata = () => {
    setLoading(true);
    const skip = paginationModel.pageIndex * paginationModel.pageSize;
    const limit = paginationModel.pageSize + skip;
    let userList: any = localStorage.getItem("Users");
    let temp = JSON.parse(userList)
    setInitialData(temp.slice(skip, limit));
    setTotalRows(temp.length);
    setLoading(false);
  };

  const deleteUser = (id: any): void => {
    let userList: any = localStorage.getItem("Users");
    const updatedArray: any = [];
    for (const item of JSON.parse(userList)) {
      if (item.id !== id) {
        updatedArray.push(item);
      }
    }
    setTotalRows(updatedArray.length);
    localStorage.setItem("Users", JSON.stringify(updatedArray));
    toast.success("User Deleted Successfully");
  };

  const columns = useMemo(
    () => [
      {
        header: "User ID",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableSorting: true,
      },
      {
        header: "Role",
        accessorKey: "role",
        enableSorting: true,
      },
      {
        header: "Actions",
        id: "actions",

        Cell: ( { row } :any) => (
          <div className="flex gap-2">
            <button
              onClick={() => deleteUser(row.original.id)}
              className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-auto"
            >
              Delete
            </button>
            <button

            className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-auto"
              onClick={() => {
                setShowModal(true);
                setEditId(row.original.id);
                setMode("edit");
              }}
            >
              Edit
            </button>
          </div>
        ),
        sortable: false,
      },
    ],
    []
  );
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode,
          primary: {
            main: "#000",
          },
          info: {
            main: "#3b82f6",
          },
          background: {
            default: globalTheme.palette.mode === "light" ? "#fff" : "#000",
          },
        },
        typography: {
          button: {
            textTransform: "none",
            fontSize: "1.2rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: "pink",
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  const table = useMaterialReactTable({
    columns,
    data: initialData,
    enableStickyHeader: true,
    manualPagination: true,
    enableStickyFooter: true,
    enableColumnResizing: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    layoutMode: "grid",
    paginationDisplayMode: "pages",
    positionGlobalFilter: "left",
    getRowId:(row:any)=>row.id,
    onRowSelectionChange: setRowSelection,
    muiSearchTextFieldProps: {
      placeholder: "Search all users",
      sx: { minWidth: "300px" },
      variant: "outlined",
    },
    initialState: {
      columnPinning: { right: ["actions"] },
      showGlobalFilter: true,
    },
    onPaginationChange: setPaginationModel,
    rowCount: totalRows,
    state: { pagination: paginationModel, rowSelection },
  });

  const handleSearch = (partialValue:any) => {
    let userList: any = localStorage.getItem("Users");
    let tempData = JSON.parse(userList)
    if (partialValue?.length > 0) {
      let temp = tempData.filter((item:any) => {
        for (const key in item) {
          if (item[key].includes(partialValue)) {
            return true;
          }
        }
        return false;
      });
      setInitialData(temp);
    } else {
      getdata();
    }
  };

  const multipleDelete = () => {
    let userList: any = localStorage.getItem("Users");
    let  myArr:any = JSON.parse(userList);
    const Keys = Object.keys(rowSelection)
    const newArrayOfObjects = myArr.filter((obj:any) => !Keys.includes(obj.id));
    localStorage.setItem("Users", JSON.stringify(newArrayOfObjects));
    setTotalRows(newArrayOfObjects.length);
    setRowSelection({});
    toast.success(`${Keys.length} Users Deleted Successfully`);
  };

  useEffect(() => {
    getdata();
  }, [paginationModel.pageIndex, paginationModel.pageSize, totalRows,update]);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <>
        <h1 className="text-4xl my-4  fornt-bold ml-20 uppercase">Admin DashBoard</h1>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mb-10 mx-20">
          <div className="flex w-full flex-col justify-between mb-4 space-y-2 border-b pb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-3">
              <div className="flex border p-2 rounded-sm h-fit flex-1 lg:mr-5 ">
                <button className="">
                  <svg
                    className="fill-gray-500 hover:fill-blue-700 dark:fill-black dark:hover:fill-blue-700"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                      fill=""
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
                />
              </div>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setMode("add");
                  }}
                  className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-auto"
              
                >
                  Add Staff
                </button>
            </div>
                

            <div className="max-w-full overflow-x-auto mt-2">
              <ThemeProvider theme={tableTheme}>
                <MaterialReactTable table={table} />
              </ThemeProvider>
            </div>
          </div>
          {Object.keys(rowSelection).length > 0 && (
            <button
              className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-auto"
              type="submit"
              onClick={() => multipleDelete()}
            >
              Deleted Selected Users
            </button>
          )}
          {showModal && <EditUser setId={setAddId} id={mode === "edit" ? editId : addId} update={update} setUpdate = {setUpdate} mode={mode} setShowModal={setShowModal} />}
        </div>
        </>
      )}
    </>
  );
};
