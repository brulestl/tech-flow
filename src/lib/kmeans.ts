export interface Cluster {
  id: number;
  title: string;
  description: string;
  count: number;
  resourceIds: number[];
  icon: string;
  color: string;
}

export function kmeans(data: number[][], k: number, maxIterations = 100): Cluster[] {
  // Initialize centroids randomly
  const centroids = data.slice(0, k);

  let iterations = 0;
  let clusters = new Array(k);

  while (iterations < maxIterations) {
    clusters = data.map(() => []);

    // Assign data points to the nearest centroid
    data.forEach((point, index) => {
      let minDistance = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, i) => {
        const distance = euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = i;
        }
      });

      clusters[clusterIndex].push(index);
    });

    // Update centroids
    centroids.forEach((centroid, i) => {
      const clusterPoints = clusters[i].map(index => data[index]);
      centroids[i] = calculateMean(clusterPoints);
    });

    iterations++;
  }

  return clusters.map((cluster, i) => ({
    id: i,
    title: `Cluster ${i + 1}`,
    description: `Cluster of ${cluster.length} items`,
    count: cluster.length,
    resourceIds: cluster,
    icon: 'BookOpen',
    color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)
  }));
}

function euclideanDistance(point1: number[], point2: number[]): number {
  return Math.sqrt(point1.reduce((sum, value, index) => sum + Math.pow(value - point2[index], 2), 0));
}

function calculateMean(points: number[][]): number[] {
  const numPoints = points.length;
  const numDimensions = points[0].length;
  const mean = new Array(numDimensions).fill(0);

  points.forEach(point => {
    point.forEach((value, index) => {
      mean[index] += value / numPoints;
    });
  });

  return mean;
} 