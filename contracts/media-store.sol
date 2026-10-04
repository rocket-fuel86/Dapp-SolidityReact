// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MediaStore{
    struct Media{
        address creator;
        string cid;
        string name;
        uint timestamp;
    }

    Media[] pics;

    function new_file(string memory cid, string memory name) external{
        pics.push(
            Media(msg.sender, cid, name, block.timestamp)
        );
    }

    function delete_file(uint idx) external {
        require(idx < pics.length, "File not found");
        require(pics[idx].creator == msg.sender, "Not the file owner");

        pics[idx] = pics[pics.length - 1];

        pics.pop();
    }

    function get_files()external view returns(Media[] memory){
        return pics;
    }

    function get_file(uint idx) external view returns(Media memory){
        require(idx < pics.length, "File not found");
        return pics[idx];
    }
}