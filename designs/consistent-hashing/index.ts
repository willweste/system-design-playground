import crypto from "crypto";

class ConsistentHashing {
    // The arrays below represent an owner : token relationship. So the owner 
    // is the server and the token is the SHA value of a server. A Map cannot 
    // be used because we need these values ordered to traverse clockwise & anticlockwise.
    private tokens: number[] = [] // This is a parallel array with owners
    private owners: string[] = [] // This is a parallel array with tokens

    // basic sha256 hash
    private hashToUint32(input: string): number {
        const hex = crypto.createHash("sha256").update(input).digest("hex");
        // 8 hex chars = 32 bits
        return Number.parseInt(hex.slice(0, 8), 16) >>> 0; // >>>0 forces unsigned 32-bit
    }

    private findPlacement(input: number): number {
        // Use binary search here to find the placement of our input inbetween two servers
        const arr = this.tokens // references this.tokens; mutates this.tokens if arr does (push/splice/etc.)
        let low = 0
        let high = arr.length

        while(low < high) {
            let mid = Math.floor((high + low) / 2);
            // mid value is too small; input cannot go at mid or anything left of mid
            if(arr[mid] < input){
                low = mid + 1
            } else{
                high = mid
            }
        }
        // when low === high
        return low
    }

    public addServer(serverName: string): void {
        const serverId = this.hashToUint32(serverName);
        const serverInsertionIndex = this.findPlacement(serverId)
        // insert new server, servers are tied to two parallel arrays (tokens, owners)
        this.tokens.splice(serverInsertionIndex, 0, serverId) // tokens update
        this.owners.splice(serverInsertionIndex, 0, serverName) // owners update 
    }

    public getServer(key: string): string{
        if (this.owners.length === 0) {
            throw new Error("Can't get server, Zero servers exist currently.");
          }
        
          const keyId = this.hashToUint32(key);
          const keyIndex = this.findPlacement(keyId);
          // this is because this.findPlacement can return a tokens.length, and when this happens we wrap
          const i = keyIndex === this.tokens.length ? 0 : keyIndex; 
        
          return this.owners[i];
    }

}

const hash = new ConsistentHashing();
hash.addServer('east')
console.log(hash.getServer('user12'))