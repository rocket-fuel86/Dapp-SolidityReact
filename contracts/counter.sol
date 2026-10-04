// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint counter;
 
    function get_counter() public view returns (uint) {
        return counter;
    }
 
    function increase() public {
        counter++;
    }
 
    function decrease() public {
        counter--;
    }
}
 
