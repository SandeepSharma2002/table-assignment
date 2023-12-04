import {
  MRT_PaginationState,
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
  const [rowSelection, setRowSelection] = useState({});
  const [initialData, setInitialData] = useState<any>([]);

  const globalTheme = useTheme();

  useEffect(() => {
    const skip = paginationModel.pageIndex * paginationModel.pageSize;
    const limit = paginationModel.pageSize + skip;
    userData.getUsers().then((res: any) => {
      localStorage.setItem("Users", JSON.stringify(res));
      setInitialData(res?.slice(skip, limit));
      setTotalRows(res.length);
      setLoading(false);
    });
  }, []);

  const getdata = () => {
    setLoading(true);
    const skip = paginationModel.pageIndex * paginationModel.pageSize;
    const limit = paginationModel.pageSize + skip;
    let userList: any = localStorage.getItem("Users");
    let temp = JSON.parse(userList)
    const arr = Object.values(temp);
    setInitialData(arr.slice(skip, limit));
    setTotalRows(arr.length);
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
              className="shadow-md bg-blue-700 px-4 py-1.5 text-white rounded-md whitespace-nowrap"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setShowModal(true);
                setEditId(row.original.id);
              }}
              className="shadow-md bg-blue-700 px-4 py-1.5 text-white rounded-md whitespace-nowrap"
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

    if (partialValue?.length > 1) {
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
    let  myObject:any = JSON.parse(userList);
    let updatedObject:any ={};
    const Keys = Object.keys(rowSelection)
    for (const key in myObject) {
      if (myObject.hasOwnProperty(key) && !Keys.includes(myObject[key].id)) {
        updatedObject[key] = myObject[key];
      }
    }
    localStorage.setItem("Users", JSON.stringify(updatedObject));
    setTotalRows(Object.keys(updatedObject).length);
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
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 my-10 mx-20">
          <div className="flex w-full flex-col justify-between mb-4 space-y-2 border-b pb-6">
                <div className="flex border flex-col p-2 rounded-sm h-fit flex-1 lg:mr-5 ">
                    <label htmlFor=""> Search User</label>
                  <input
                    type="text"
                    placeholder="Search Users..."
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="w-full bg-transparent border mt-2 pl-4 p-2 font-medium focus:outline-none xl:w-125"
                  />
            </div>

            <div className="max-w-full overflow-x-auto mt-2">
              <ThemeProvider theme={tableTheme}>
                <MaterialReactTable table={table} />
              </ThemeProvider>
            </div>
          </div>
          {Object.keys(rowSelection).length > 0 && (
            <button
              className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 col-span-2 ml-auto"
              type="submit"
              onClick={() => multipleDelete()}
            >
              Deleted Selected Users
            </button>
          )}
          {showModal && <EditUser id={editId} update={update} setUpdate = {setUpdate} setShowModal={setShowModal} />}
        </div>
      )}
    </>
  );
};
