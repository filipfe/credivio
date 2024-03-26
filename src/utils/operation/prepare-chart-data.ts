export default function prepareChartData(data: Operation[]): Option<number>[] {
  return data
    .map(({ amount, title, label }) => ({
      value: parseFloat(amount),
      name: label || title,
    }))
    .reduce((prev: Option<number>[], curr) => {
      const groupIndex = prev.findIndex((item) => item.name === curr.name);
      if (groupIndex !== -1) {
        let temp = [...prev];
        temp[groupIndex].value += curr.value;
        return temp;
      }
      return [...prev, { name: curr.name, value: curr.value }];
    }, []);
}
