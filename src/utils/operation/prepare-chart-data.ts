export default function prepareChartData(data: Operation[]) {
  return data
    .map(({ amount, title }) => ({ value: parseFloat(amount), name: title }))
    .reduce((prev: Option[], curr) => {
      const groupIndex = prev.findIndex((item) => item.name === curr.name);
      if (groupIndex !== -1) {
        let temp = [...prev];
        temp[groupIndex].value += curr.value;
        return temp;
      }
      return [...prev, { name: curr.name, value: curr.value }];
    }, []);
}
