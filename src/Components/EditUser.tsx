/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import React from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Loader";

interface setShowModalFunc {
  setShowModal: Function;
  id: any;
  setId?: Function | any;
  update?: boolean;
  setUpdate?: any;
  mode: string;
}

const EditUser: React.FC<setShowModalFunc> = ({
  setShowModal,
  id,
  setUpdate,
  update,
  setId,
  mode
}): any => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectRole, setRole] = useState();
  const [userList, setUserList] = useState([]);
  const form = useForm();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<any> = (formData:any) => {
    if(mode == "edit")
    {
    let temp:any = userList.map((item:any) => (item.id === formData.id ? { ...item, ...formData } : item));
    localStorage.setItem("Users", JSON.stringify(temp));
    toast.success("User Updated Successfully");
    setShowModal(false);
    setUpdate(!update);
    }
    else{
    let userList: any = localStorage.getItem("Users");
    let  myArr:any = JSON.parse(userList);
    myArr.push(formData);
    localStorage.setItem("Users", JSON.stringify(myArr));
    setId((parseInt(id, 10) + 1).toString());
    toast.success("New User Added Successfully");
    setShowModal(false);
    setUpdate(!update);
    }
  };

  const getData = async () => {
        setLoading(true);
        let Users:any = localStorage.getItem("Users");
        setUserList(JSON.parse(Users));
        let temp = JSON.parse(Users).find((item:any) => item.id === id);
        setData(temp);
        setRole(temp.role);
        setValue('id',temp.id),
        setValue("email",temp.email)
        setValue('name',temp.name)
        setValue('role',temp.role)
        setLoading(false);
  };

  const handleDropdownChange = (name: string, value: any) => {
    if (name === "role"){
      setRole(value);
    }
  };
  const roles = [
    { value: "admin", label: "Admin" },
    { value: "member", label: "Member" },
  ];

  useEffect(() => {
    if(mode == "edit")
    getData();
  else
  setValue("id",id);
  }, []);

  return (
    <>
    <ToastContainer/>
      <div className="z-[100] justify-center mb-10 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none mx-5 mt-20">
        <div className="w-full my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg flex flex-col w-full px-5 bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between pt-3 px-2 md:p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h6 className="text-sm md:text-3xl font-semibold">
               {mode === "edit" ? "Edit User" : "Add New User"}
              </h6>
              <button
                className="p-1 ml-auto border-0 text-black opacity-60 float-right text-3xl leading-none font-semibold"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="black"
                    d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"
                  />
                </svg>
              </button>
            </div>
            {loading ? <Loader/> : 
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:grid md:grid-cols-2 gap-4 my-4"
            >
                <div className="flex flex-col space-y-1">
                <label className="font-medium" htmlFor="id">
                 User Id
                </label>
                <input
                  id="id"
                  type="number"
                  value={id}
                  disabled
                  className="border outline-[#2684ff] p-2 rounded-md border-[#ccc] w-full [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none pointer-events-none"
                  {...register("id")}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  defaultValue={data?.name}
                  {...register("name",{required: "Name is required",})}
                  className="border p-2 rounded-md border-[#ccc] outline-[#2684ff] w-full"
                  placeholder="Enter First Name"
                />
                {errors?.name && (
                  <p className="text-red-500 text-xs left-0 w-full">
                    Please Enter Name
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-medium" htmlFor="phone">
                  Enter Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={data?.email}
                  className="border outline-[#2684ff] p-2 rounded-md border-[#ccc] w-full [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Enter Email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors?.email && (
                  <p className="text-red-500 text-xs left-0 w-full">
                    Please Enter Email
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col lg:max-w-sm gap-1">
                <label className="font-medium" htmlFor="role">
                 Role
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      key={field.name}
                      options={roles}
                      className="flex-1 w-full"
                      defaultValue={selectRole}
                      value={roles?.find((opt) => opt.value === selectRole)}
                      onChange={(option) => {
                        handleDropdownChange("role", option?.value);
                        field.onChange(option?.value);
                      }}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: "40px", // Adjust the height of the control
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999, // Set a high zIndex value to ensure dropdown is on top of other elements
                        }),
                      }}
                      placeholder="Select Role"
                      required
                    />
                  )}
                />
              </div>
            
              <button
                className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 col-span-2 ml-auto"
                type="submit"
              >
               Update User
              </button>
            </form>
        }
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-10 bg-black"></div>
    </>
  );
};

export default EditUser;
