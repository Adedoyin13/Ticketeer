import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const override = {
    display: "block",
    margin: "100px auto"
};

const Loader = ({loading}) => {
  return (
    <ClipLoader
        color='#EA670C'
        loading={loading}
        cssOverride={override}
        size={50}
    />
  )
}

export default Loader