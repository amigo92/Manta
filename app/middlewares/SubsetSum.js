 export default function SubsetSum(numbersDict, target) {
    const arr = numbersDict

    const sum = target

    let result = null
    function subset_sum(numbers, target, partial) {
        let n, remaining

        const newPartial = partial || []
        const s = newPartial.reduce((a, b) => a + b.distance || 0, 0)

        if (s > target) return null
    
        // check if the partial sum is equals to target
        if (s === target) {
            if (!result) result = []
            result.push(newPartial)
            // console.log("%s=%s", partial.join("+"), target)
        }

        for (let i = 0; i < numbers.length; i++) {
            n = numbers[i]
            remaining = numbers.slice(i + 1)
            subset_sum(remaining, target, newPartial.concat([n]))
        }

        return result
    }

    // lets calculate time
    return subset_sum(arr, sum)
}