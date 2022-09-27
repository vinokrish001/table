import { useState, useEffect } from 'react'
import { Table, Avatar, Input, Button } from 'antd';
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from 'axios';
import 'antd/dist/antd.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import { Rating } from 'react-simple-star-rating'
import { BugOutlined } from '@ant-design/icons'

import './App.css';

function App() {
    const [statistics, setStatistics] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const initialData = {
        title: "",
        brand: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        rating: "",
    };
    const [editModal, setEditModal] = useState({ data: initialData, show: false })

    const getProductData = async () => {
        try {
            setLoading(true)
            let insightsResult = await fetch("https://dummyjson.com/products")
            let resultJson = await insightsResult.json();
            if (resultJson.products.length > 0) {
                setStatistics(resultJson?.products);
                setLoading(false)
            } else {
                setStatistics({});
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            console.log("err", err);
        }
    };

    useEffect(() => {
        getProductData()
    }, [])
    useEffect(() => {
        setFilteredProducts(statistics)
    }, [statistics])
    const editFn = (e) => {
        setEditModal({ data: e, show: true })
    }
    const columns = [
        {
            title: '',
            dataIndex: 'edit',
            key: 'edit',
            render: (_, record) => (
                <div className='edit text-right' onClick={() => editFn(record)}><i className="bi bi-pencil-fill"></i></div>
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (_, { id }) => (
                <div className='productId'>{id}</div>
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (_, { title }) => (
                <div className='title'>{title}</div>
            ),
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Discount Percentage',
            dataIndex: 'discountPercentage',
            key: 'discountPercentage',
            render: (_, { discountPercentage }) => (
                <div className=''>{discountPercentage}%</div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, { price }) => (
                <div className=''>Rs.{price}</div>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (_, { rating }) => (
                <Rating size={20} ratingValue={Number(rating) * 20} />
            ),
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: '',
            dataIndex: 'delete',
            key: 'delete',
            render: () => (
                <div className='delete'>
                    <i className="bi bi-trash-fill"></i>
                </div>
            ),
        },
        // {
        //     title: 'Title',
        //     dataIndex: 'title',
        //     key: 'title',
        // },
    ];
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };
    const productValidation = Yup.object().shape({
        title: Yup.string().trim().required("Title is required"),
        brand: Yup.string().trim().required("Brand is required"),
        category: Yup.string().trim().required("Category is required"),
        description: Yup.string().required("Description is required"),
        price: Yup.number().required("Price is required"),
        stock: Yup.number().required("Stock is required"),
        rating: Yup.string().required("Rating is required"),
    });
    const formik = useFormik({
        initialValues: editModal.data,
        enableReinitialize: true,
        validationSchema: productValidation,
        validateOnMount: true,
        onSubmit: async (values, { resetForm }) => {
            console.log('values----->', values);
            try {
                const response = await axios.put(`https://dummyjson.com/products/${values.id}`, values)
                console.log('res', response);
            } catch (error) {
                const { response } = error;
                console.log('err', response);
            }
            setEditModal({ data: initialData, show: false })

        },
    });
    const inputType = (value) => {
        if (value.type === "text") {
            return (
                <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    placeholder={value.placeholder}
                    {...formik.getFieldProps(value.key)}
                />
            );
        }
    };
  
    const editDetails = [
        {
            label: "Product title",
            placeholder: "Product title",
            key: "title",
            type: "text",
        },
        {
            label: "Brand",
            placeholder: "Brand",
            key: "brand",
            type: "text",
        },
        {
            label: "Category",
            placeholder: "Category",
            key: "category",
            type: "text",
        },
        {
            label: "Description",
            placeholder: "Description",
            key: "description",
            type: "text",
        },
        {
            label: "Price",
            placeholder: "Price",
            key: "price",
            type: "text",
        },
        {
            label: "Stock",
            placeholder: "Stock",
            key: "stock",
            type: "text",

        },
        {
            label: "Rating",
            placeholder: "Rating ",
            key: "rating",
            type: "text",
        },
    ];
    const filterData = (e) => {
        const text = (e.target.value).toLowerCase();
        const result = statistics.filter((data) => {
            return (data.title.toLowerCase().includes(text) || data.brand.toLowerCase().includes(text) || data.category.toLowerCase().includes(text))
        })
        setFilteredProducts(result)

    }
    return (
        <>
            <div className="App">
                <div className='me-4 d-none d-sm-flex headerBar' style={{ marginTop: "10px", justifyContent: "space-between", alignItems: 'center' }}>
                    <div >
                        <Input placeholder="Search Title, Brand, Category, etc." className='searchField' onChange={(e) => filterData(e)} />
                    </div>
                    <div>
                        <BugOutlined /> Report Bug
                    </div>
                    <div>
                        <div className='align-items-center' style={{ display: "flex" }}>
                            <div className='me-3'>
                                Matt</div>
                            <div> <Avatar size={40} className='avathar'>U</Avatar></div>
                        </div>
                    </div>
                </div>
                <nav className="navbar navbar-light bg-light d-flex headerBarMobile   d-sm-none">
                    <div className="container-fluid">
                        <form className="d-flex w-100 justify-content-between align-items-center ">
                            <input className="form-control me-2 w-80 searchFieldMobile" type="search" placeholder="Search Title, Brand, Category, etc." aria-label="Search" onChange={(e) => filterData(e)} />
                            <span className=" mx-1 headerText avathar " type="submit">Vinoth</span>
                            <div>
                                <Avatar size={35}>U</Avatar>
                            </div>
                        </form>
                    </div>
                </nav>
                <div className='d-flex justify-content-between mx-4 my-3'>
                    <div className='manageColumn'>
                        <i className="bi bi-list-columns-reverse"></i>Manage columns
                    </div>
                    <div className='d-flex '>
                        <div className='delete me-3'>
                            <i className="bi bi-trash-fill"></i>
                            <span className='ms-1'>Delete</span>
                        </div>
                        <div className='edit'>
                            <i className="bi bi-pencil-fill"></i>
                            <span className='ms-1'>Edit</span>
                        </div>
                    </div>

                </div>
                <div className='d-none d-sm-block'>
                    <Table
                        columns={columns}
                        //   rowKey={(record) => record.login.uuid}
                        // dataSource={arr}
                        dataSource={filteredProducts}
                        pagination={tableParams.pagination}
                        // loading={loading}
                        scroll={true}

                        onChange={handleTableChange}
                    />
                </div>
                <div className='d-block d-sm-none'>
                    {filteredProducts.map((data, index) => {
                        return (
                            <div className='m-2 card p-3' key={index}>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start '>Id</div>
                                    <div className=' text-start productId'>{data.id}</div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start'>Title</div>
                                    <div className='col-8 productValue text-start title'>{data.title}</div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start'>Brand</div>
                                    <div className='col-8 productValue text-start'>{data.brand}</div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start'>Category</div>
                                    <div className='col-8 productValue text-start'>{data.category}</div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start'>Description</div>
                                    <div className='col-8 productValue text-start'>{data.description}</div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start '>Discount Percentage</div>
                                    <div className='col-8 productValue text-start discount'>{data.discountPercentage}</div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start'>Price</div>
                                    <div className='col-8 productValue text-start'>{data.price}</div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start'>Rating</div>
                                    <div className='col-8 productValue text-start'> <Rating size={20} ratingValue={Number(data.rating) * 20} /></div>
                                </div>
                                <div className='d-flex productKeys mb-2'>
                                    <div className='col-4 productDetail text-start'>Stock</div>
                                    <div className='col-8 productValue text-start'>{data.stock}</div>   
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <Button type="primary " className='me-2' onClick={() => setEditModal({data:data, show: true })}>Edit</Button>
                                    <Button danger type="primary">Primary</Button>
                                </div>


                            </div>
                        )
                    })}
                </div>

            </div>
            <Modal
                show={editModal.show}
                dialogClassName=""
                centered
                onHide={() => setEditModal((val) => ({ ...val, show: false }))}
            >
                <form
                    onSubmit={formik.handleSubmit}
                    noValidate
                    className="modal-content"
                >
                    <div className="modal-header">
                        <h2>Edit Product</h2>
                        <i className="bi bi-x-circle-fill fs-1" onClick={() => setEditModal((val) => ({ ...val, show: false }))}></i>
                    </div>
                    <div className="card-body border-top p-3    ">
                        {editDetails.map((data, index) => {
                            return (
                                <div className="row mb-3" key={index}>
                                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                                        {data.label}
                                    </label>
                                    <div className="col-lg-8 fv-row">
                                        {inputType(data)}
                                        {formik.touched[data.key] && formik.errors[data.key] && (
                                            <div className="fv-plugins-message-container">
                                                <div className="fv-help-block" style={{ color: "red" }}>
                                                    {formik.errors[data.key]}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className='d-flex justify-content-end m-4'>

                        <button type="submit" className="btn btn-primary" disabled={false}>
                            <span className="indicator-progress" style={{ display: "block" }}>
                                Update Product
                            </span>
                        </button>
                    </div>
                </form>
            </Modal>
        </>

    );
}

export default App;
