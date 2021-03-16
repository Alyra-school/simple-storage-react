// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  uint storedData;

  event StoredData(uint indexed storedData);
  event StoredData1(uint  storedData);

  function set(uint x) public {
    storedData = x;
    emit StoredData(storedData);
    emit StoredData1(storedData);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
