import { useEffect, useState } from "react";
import web3 from "./lib/web3";
import mediaContract from "./contracts/media_contract";
import lighthouse from "@lighthouse-web3/sdk";

const Media = () => {

    const storageUrl = "";
    const apiKey = "";

    const [account, setAccount] = useState("");
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);

    const [loading, setLoading] = useState(false);
    const [deletingIndex, setDeletingIndex] = useState(null);

    useEffect(() => {
        const loadAccounts = async () => {
            const accounts = await web3.eth.getAccounts();

            if (accounts.length > 0) {
                console.log("Accounts:", accounts);
                setAccount(accounts[0]);
            }
        };

        loadAccounts();

        const handleChangedAccount = (accounts) => {
            console.log("Accounts(handler):", accounts);

            if (accounts.length > 0) {
                setAccount(accounts[0]);
            } else {
                setAccount("");
            }
        };

        window.ethereum.on("accountsChanged", handleChangedAccount);

        return () => {
            window.ethereum.removeListener(
                "accountsChanged",
                handleChangedAccount
            );
        };
    }, []);

    const loadFiles = async () => {
        try {
            const result = await mediaContract.methods
                .get_files()
                .call();

            console.log("Files:", result);

            setFiles(result);
        } catch (error) {
            console.error("Could not load files:", error);
        }
    };

    useEffect(() => {
        if (account) {
            loadFiles();
        }
    }, [account]);

    const createFile = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Select a file");
            return;
        }

        if (!fileName) {
            alert("Enter file name");
            return;
        }

        try {
            setLoading(true);

            const uploadedResult = await lighthouse.upload(
                [file],
                apiKey
            );

            const newCid = uploadedResult.data.Hash;

            await mediaContract.methods
                .new_file(newCid, fileName)
                .send({ from: account });

            setFileName("");
            setFile(null);

            await loadFiles();

        } catch (error) {
            console.error(error);
            alert("Could not upload file");
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = async (index) => {
        try {
            setDeletingIndex(index);

            await mediaContract.methods
                .delete_file(index)
                .send({ from: account });

            await loadFiles();

        } catch (error) {
            console.error(error);
            alert("Could not delete file");
        } finally {
            setDeletingIndex(null);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(
            Number(timestamp) * 1000
        ).toLocaleString();
    };

    return (
        <div className="media-container">

            <h1>Account: {account}</h1>

            <form onSubmit={createFile} className="upload-form">

                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Set name for file"
                    disabled={loading}
                />

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload file"}
                </button>

            </form>

            <hr />

            <h2>All files</h2>

            {files.length === 0 && (
                <p>No files uploaded.</p>
            )}

            <div className="media-grid">

                {files.map((item, index) => (

                    <div className="media-card" key={index}>

                        <img
                            src={`${storageUrl}${item.cid}`}
                            alt={item.name}
                            className="media-image"
                        />

                        <div className="media-info">

                            <h3>{item.name}</h3>

                            <p>
                                <b>Author:</b>
                                <br />
                                {item.creator}
                            </p>

                            <p>
                                <b>Created:</b>
                                <br />
                                {formatDate(item.timestamp)}
                            </p>

                            <p>
                                <b>CID:</b>
                                <br />
                                {item.cid}
                            </p>

                            {item.creator.toLowerCase() ===
                                account.toLowerCase() && (

                                <button
                                    onClick={() => deleteFile(index)}
                                    disabled={deletingIndex !== null}
                                >
                                    {deletingIndex === index
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Media;