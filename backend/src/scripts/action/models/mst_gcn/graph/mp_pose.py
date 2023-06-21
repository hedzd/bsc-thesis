import numpy as np
import sys

sys.path.extend(['../'])
from . import tools
import networkx as nx

# Edge format: (origin, neighbor)
num_node = 33
self_link = [(i, i) for i in range(num_node)]
inward = [(8, 6), (6, 5), (5, 4), (4, 0), (0, 1), (1, 2), (2, 3), (3, 7), 
        (10, 9), 
        (18, 20), (16, 20), (20, 16), (16, 22), 
        (16, 14), (14, 12), (12, 11), (11, 13), (13, 15),
        (15, 21), (15, 19), (15, 17), (19, 17),
        (12, 24), (24, 23), (23, 11), 
        (24, 26), (26, 28), (28, 32), (32, 30), (28, 30),
        (23, 25), (25, 27), (27, 29), (29, 31), (27, 31),
        ]
outward = [(j, i) for (i, j) in inward]
neighbor = inward + outward


class mp_Graph:
    def __init__(self, labeling_mode='spatial'):
        self.A = self.get_adjacency_matrix(labeling_mode)
        self.num_node = num_node
        self.self_link = self_link
        self.inward = inward
        self.outward = outward
        self.neighbor = neighbor

    def get_adjacency_matrix(self, labeling_mode=None):
        if labeling_mode is None:
            return self.A
        if labeling_mode == 'spatial':
            A = tools.get_spatial_graph(num_node, self_link, inward, outward)
        else:
            raise ValueError()
        return A


if __name__ == '__main__':
    A = mp_Graph('spatial').get_adjacency_matrix()
    print('')