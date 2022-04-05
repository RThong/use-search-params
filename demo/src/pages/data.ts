const data = Array(46)
  .fill(undefined)
  .map((_, i) => {
    const temp = Math.random();

    return {
      key: `${i}`,
      name: `Edward King ${i}`,
      status: temp > 0.6 ? 'running' : temp > 0.2 ? 'success' : 'failed',
      address: `London, Park Lane no. ${i}`,
    };
  });
export default data;
