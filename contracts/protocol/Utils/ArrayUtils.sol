library ArrayUtils {

    function sum(uint[] memory self) internal constant returns (uint result) {
        result = self[0];
        for (uint i = 1; i < self.length; i++) {
            result += self[i];
        }
    }
}
