/*
 * Copyright 2023 The Yorkie Authors. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * About `index`, `path`, `size` and `TreePos` in crdt.IndexTree.
 *
 * `index` of crdt.IndexTree represents a absolute position of a node in the tree.
 * `size` is used to calculate the relative index of nodes in the tree.
 * `index` in yorkie.IndexTree inspired by ProseMirror's index.
 *
 * For example, empty paragraph's size is 0 and index 0 is the position of the:
 *    0
 * <p> </p>,                                p.size = 0
 *
 * If a paragraph has <i>, its size becomes 2 and there are 3 indexes:
 *     0   1    2
 *  <p> <i> </i> </p>                       p.size = 2, i.size = 0
 *
 * If the paragraph has <i> and <b>, its size becomes 4:
 *     0   1    2   3   4
 *  <p> <i> </i> <b> </b> </p>              p.size = 4, i.size = 0, b.size = 0
 *     0   1    2   3    4    5   6
 *  <p> <i> </i> <b> </b> <s> </s> </p>     p.size = 6, i.size = 0, b.size = 0, s.size = 0
 *
 * If a paragraph has text, its size becomes length of the characters:
 *     0 1 2 3
 *  <p> A B C </p>                          p.size = 3,   text.size = 3
 *
 * So the size of a node is the sum of the size and type of its children:
 *  `size = children(block type).length * 2 + children.reduce((child, acc) => child.size + acc, 0)`
 *
 * `TreePos` is also used to represent the position in the tree. It contains node and offset.
 * `TreePos` can be converted to `index` and vice versa.
 *
 * For example, if a paragraph has <i>, there are 3 indexes:
 *     0   1    2
 *  <p> <i> </i> </p>                       p.size = 2, i.size = 0
 *
 * In this case, index of TreePos(p, 0) is 0, index of TreePos(p, 1) is 2.
 * Index 1 can be converted to TreePos(i, 0).
 *
 * `path` of crdt.IndexTree represents a position like `index` in crdt.IndexTree.
 * It contains offsets of each node from the root node as elements except the last.
 * The last element of the path represents the position in the parent node.
 *
 * Let's say we have a tree like this:
 *                     0 1 2
 * <p> <i> a b </i> <b> c d </b> </p>
 *
 * The path of the position between 'c' and 'd' is [1, 1]. The first element of the
 * path is the offset of the <b> in <p> and the second element represents the position
 * between 'c' and 'd' in <b>.
 */

/**
 * `BlockNodePaddingSize` is the size of a block node as a child of another block node.
 * Because a block node could be considered as a pair of open and close tags.
 */
export const BlockNodePaddingSize = 2;

/**
 * `DefaultRootType` is the default type of the root node.
 * It is used when the type of the root node is not specified.
 */
export const DefaultRootType = 'root';

/**
 * `DefaultInlineType` is the default type of the inline node.
 * It is used when the type of the inline node is not specified.
 */
export const DefaultInlineType = 'text';

/**
 * `NoteType` is the type of a node in the tree.
 */
export type TreeNodeType = string;

/**
 * `IndexTreeNode` is the node of IndexTree. It is used to represent the
 * document of text-based editors.
 */
export abstract class IndexTreeNode<T extends IndexTreeNode<T>> {
  type: TreeNodeType;
  parent?: T;
  _children: Array<T>;
  size: number;

  constructor(type: TreeNodeType, children: Array<T> = []) {
    this.type = type;
    this.size = 0;
    this._children = children;

    if (this.isInline && this._children.length > 0) {
      throw new Error(`Inline node cannot have children: ${this.type}`);
    }
  }

  /**
   * `updateAncestorsSize` updates the size of the ancestors.
   */
  updateAncestorsSize(): void {
    let parent: T | undefined = this.parent;
    const sign = this.isRemoved ? -1 : 1;

    while (parent) {
      parent.size += this.paddedSize * sign;
      parent = parent.parent;
    }
  }

  /**
   * `isInline` returns true if the node is a inline node.
   */
  get isInline(): boolean {
    // TODO(hackerwins): We need to get the type of inline node from user.
    // Consider the use schema to get the type of inline node.
    return this.type === DefaultInlineType;
  }

  /**
   * `paddedSize` returns the size of the node including padding size.
   */
  get paddedSize(): number {
    return this.size + (this.isInline ? 0 : BlockNodePaddingSize);
  }

  /**
   * `isAncenstorOf` returns true if the node is an ancestor of the given node.
   */
  isAncestorOf(node: T): boolean {
    return ancestorOf(this as any, node);
  }

  /**
   * `nextSibling` returns the next sibling of the node.
   */
  get nextSibling(): T | undefined {
    const offset = this.parent!.findOffset(this as any);
    const sibling = this.parent!.children[offset + 1];
    if (sibling) {
      return sibling;
    }

    return undefined;
  }

  /**
   * `split` splits the node at the given offset.
   */
  split(offset: number): T | undefined {
    if (this.isInline) {
      return this.splitInline(offset);
    }

    return this.splitBlock(offset);
  }

  /**
   * `isRemoved` returns true if the node is removed.
   */
  abstract get isRemoved(): boolean;

  /**
   * `clone` clones the node with the given id and value.
   */
  abstract clone(offset: number): T;

  /**
   * `value` returns the value of the node.
   */
  abstract get value();

  /**
   * `value` sets the value of the node.
   */
  abstract set value(v: string);

  /**
   * `splitInline` splits the given node at the given offset.
   */
  splitInline(offset: number): T | undefined {
    if (offset === 0 || offset === this.size) {
      return;
    }

    const leftValue = this.value.slice(0, offset);
    const rightValue = this.value.slice(offset);

    this.value = leftValue;

    const rightNode = this.clone(offset);
    rightNode.value = rightValue;
    this.parent!.insertAfterInternal(rightNode, this as any);

    return rightNode;
  }

  /**
   * `children` returns the children of the node.
   */
  get children(): Array<T> {
    // Tombstone nodes remain awhile in the tree during editing.
    // They will be removed after the editing is done.
    // So, we need to filter out the tombstone nodes to get the real children.
    return this._children.filter((child) => !child.isRemoved);
  }

  /**
   * `hasInlineChild` returns true if the node has an inline child.
   */
  hasInlineChild(): boolean {
    return this.children.some((child) => child.isInline);
  }

  /**
   * `append` appends the given nodes to the children.
   */
  append(...newNode: Array<T>): void {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    this._children.push(...newNode);
    for (const node of newNode) {
      node.parent = this as any;
      node.updateAncestorsSize();
    }
  }

  /**
   * `prepend` prepends the given nodes to the children.
   */
  prepend(...newNode: Array<T>): void {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    this._children.unshift(...newNode);
    for (const node of newNode) {
      node.parent = this as any;
      node.updateAncestorsSize();
    }
  }

  /**
   * `insertBefore` inserts the given node before the given child.
   */
  insertBefore(newNode: T, referenceNode: T): void {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    const offset = this._children.indexOf(referenceNode);
    if (offset === -1) {
      throw new Error('child not found');
    }

    this.insertAtInternal(newNode, offset);
    newNode.updateAncestorsSize();
  }

  /**
   * `insertAfter` inserts the given node after the given child.
   */
  insertAfter(newNode: T, referenceNode: T): void {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    const offset = this._children.indexOf(referenceNode);
    if (offset === -1) {
      throw new Error('child not found');
    }

    this.insertAtInternal(newNode, offset + 1);
    newNode.updateAncestorsSize();
  }

  /**
   * `insertAt` inserts the given node at the given offset.
   */
  insertAt(newNode: T, offset: number): void {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    this.insertAtInternal(newNode, offset);
    newNode.updateAncestorsSize();
  }

  /**
   * `removeChild` removes the given child.
   */
  removeChild(childNode: T) {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    const offset = this._children.indexOf(childNode);
    if (offset === -1) {
      throw new Error('child not found');
    }

    this._children.splice(offset, 1);
    childNode.parent = undefined;
  }

  /**
   * `splitNode` splits the given node at the given offset.
   */
  splitBlock(offset: number): T | undefined {
    const clone = this.clone(offset);
    this.parent!.insertAfterInternal(clone, this as any);
    clone.updateAncestorsSize();

    const leftChildren = this.children.slice(0, offset);
    const rightChildren = this.children.slice(offset);
    this._children = leftChildren;
    clone._children = rightChildren;
    this.size = this._children.reduce(
      (acc, child) => acc + child.paddedSize,
      0,
    );
    clone.size = clone._children.reduce(
      (acc, child) => acc + child.paddedSize,
      0,
    );
    for (const child of clone._children) {
      child.parent = clone;
    }

    return clone;
  }

  /**
   * `insertAfterInternal` inserts the given node after the given child.
   * This method does not update the size of the ancestors.
   */
  insertAfterInternal(newNode: T, referenceNode: T): void {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    const offset = this._children.indexOf(referenceNode);
    if (offset === -1) {
      throw new Error('child not found');
    }

    this.insertAtInternal(newNode, offset + 1);
  }

  /**
   * `insertAtInternal` inserts the given node at the given index.
   * This method does not update the size of the ancestors.
   */
  insertAtInternal(newNode: T, offset: number): void {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    this._children.splice(offset, 0, newNode);
    newNode.parent = this as any;
  }

  /**
   * findOffset returns the offset of the given node in the children.
   */
  findOffset(node: T): number {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    return this.children.indexOf(node);
  }

  /**
   * `findBranchOffset` returns offset of the given descendant node in this node.
   * If the given node is not a descendant of this node, it returns -1.
   */
  findBranchOffset(node: T): number {
    if (this.isInline) {
      throw new Error('Inline node cannot have children');
    }

    let current: T | undefined = node;
    while (current) {
      const offset = this._children.indexOf(current);
      if (offset !== -1) {
        return offset;
      }

      current = current.parent;
    }

    return -1;
  }
}

/**
 * `TreePos` is the position of a node in the tree.
 *
 * `offset` is the position of node's token. For example, if the node is a
 * block node, the offset is the index of the child node. If the node is a
 * inline node, the offset is the index of the character.
 */
export type TreePos<T extends IndexTreeNode<T>> = {
  node: T;
  offset: number;
};

/**
 * `ancestorOf` returns true if the given node is an ancestor of the other node.
 */
function ancestorOf<T extends IndexTreeNode<T>>(ancestor: T, node: T): boolean {
  if (ancestor === node) {
    return false;
  }

  while (node.parent) {
    if (node.parent === ancestor) {
      return true;
    }
    node = node.parent;
  }
  return false;
}

/**
 * `nodesBetween` iterates the nodes between the given range.
 * If the given range is collapsed, the callback is not called.
 * It traverses the tree with postorder traversal.
 */
function nodesBetween<T extends IndexTreeNode<T>>(
  root: T,
  from: number,
  to: number,
  callback: (node: T) => void,
) {
  if (from > to) {
    throw new Error(`from is greater than to: ${from} > ${to}`);
  }

  if (from > root.size) {
    throw new Error(`from is out of range: ${from} > ${root.size}`);
  }

  if (to > root.size) {
    throw new Error(`to is out of range: ${to} > ${root.size}`);
  }

  if (from === to) {
    return;
  }

  let pos = 0;
  for (const child of root.children) {
    // If the child is a block node, the size of the child.
    if (from - child.paddedSize < pos && pos < to) {
      // If the child is a block node, the range of the child
      // is from - 1 to to - 1. Because the range of the block node is from
      // the open tag to the close tag.
      const fromChild = child.isInline ? from - pos : from - pos - 1;
      const toChild = child.isInline ? to - pos : to - pos - 1;
      nodesBetween(
        child,
        Math.max(0, fromChild),
        Math.min(toChild, child.size),
        callback,
      );

      // If the range spans outside the child,
      // the callback is called with the child.
      if (fromChild < 0 || toChild > child.size || child.isInline) {
        callback(child);
      }
    }
    pos += child.paddedSize;
  }
}

/**
 * `traverse` traverses the tree with postorder traversal.
 */
export function traverse<T extends IndexTreeNode<T>>(
  node: T,
  callback: (node: T) => void,
) {
  for (const child of node.children) {
    traverse(child, callback);
  }
  callback(node);
}

/**
 * `findTreePos` finds the position of the given index in the given node.
 */
function findTreePos<T extends IndexTreeNode<T>>(
  node: T,
  index: number,
  preperInline = true,
): TreePos<T> {
  if (index > node.size) {
    throw new Error(`index is out of range: ${index} > ${node.size}`);
  }

  if (node.isInline) {
    return { node, offset: index };
  }

  // offset is the index of the child node.
  // pos is the window of the index in the given node.
  let offset = 0;
  let pos = 0;
  for (const child of node.children) {
    // The pos is in bothsides of the inline node, we should traverse
    // inside of the inline node if preperInline is true.
    if (preperInline && child.isInline && child.size >= index - pos) {
      return findTreePos(child, index - pos, preperInline);
    }

    // The position is in leftside of the block node.
    if (index === pos) {
      return { node, offset };
    }

    // The position is in rightside of the block node and preperInline is false.
    if (!preperInline && child.paddedSize === index - pos) {
      return { node, offset: offset + 1 };
    }

    // The position is in middle the block node.
    if (child.paddedSize > index - pos) {
      // If we traverse inside of the block node, we should skip the open.
      const skipOpenSize = 1;
      return findTreePos(child, index - pos - skipOpenSize, preperInline);
    }

    pos += child.paddedSize;
    offset += 1;
  }

  // The position is in rightmost of the given node.
  return { node, offset };
}
/**
 * `getAncestors` returns the ancestors of the given node.
 */
export function getAncestors<T extends IndexTreeNode<T>>(node: T): Array<T> {
  const ancestors: Array<T> = [];
  let parent = node.parent;
  while (parent) {
    ancestors.unshift(parent);
    parent = parent.parent;
  }
  return ancestors;
}

/**
 * `findCommonAncestor` finds the lowest common ancestor of the given nodes.
 */
export function findCommonAncestor<T extends IndexTreeNode<T>>(
  nodeA: T,
  nodeB: T,
): T | undefined {
  if (nodeA === nodeB) {
    return nodeA;
  }

  const ancestorsOfA = getAncestors(nodeA);
  const ancestorsOfB = getAncestors(nodeB);

  let commonAncestor: T | undefined;
  for (let i = 0; i < ancestorsOfA.length; i++) {
    const ancestorOfA = ancestorsOfA[i];
    const ancestorOfB = ancestorsOfB[i];

    if (ancestorOfA !== ancestorOfB) {
      break;
    }

    commonAncestor = ancestorOfA;
  }

  return commonAncestor;
}

/**
 * `findLeftmost` finds the leftmost node of the given tree.
 */
export function findLeftmost<T extends IndexTreeNode<T>>(node: T): T {
  if (node.isInline || node.children.length === 0) {
    return node;
  }

  return findLeftmost(node.children[0]);
}

/**
 * `findInlinePos` returns the tree position of the given path element.
 */
function findInlinePos<T extends IndexTreeNode<T>>(
  node: T,
  pathElement: number,
) {
  if (node.size < pathElement) {
    throw new Error('unacceptable path');
  }

  for (let i = 0; i < node.children.length; i++) {
    const childNode = node.children[i];

    if (childNode.size < pathElement) {
      pathElement -= childNode.size;
    } else {
      node = childNode;

      break;
    }
  }

  return { node, offset: pathElement };
}

/**
 * `IndexTree` is a tree structure for linear indexing.
 */
export class IndexTree<T extends IndexTreeNode<T>> {
  private root: T;

  constructor(root: T) {
    this.root = root;
  }

  /**
   * `nodeBetween` returns the nodes between the given range.
   */
  nodesBetween(from: number, to: number, callback: (node: T) => void): void {
    nodesBetween<T>(this.root, from, to, callback);
  }

  /**
   * `traverse` traverses the tree with postorder traversal.
   */
  traverse(callback: (node: T) => void): void {
    traverse(this.root, callback);
  }

  /**
   * `split` splits the node at the given index.
   */
  public split(index: number, depth = 1): TreePos<T> {
    const treePos = findTreePos(this.root, index, true);

    let node: T | undefined = treePos.node;
    let offset: number = treePos.offset;
    for (let i = 0; i < depth && node && node !== this.root; i++) {
      node.split(offset);

      const nextOffset = node.parent!.findOffset(node);
      offset = offset === 0 ? nextOffset : nextOffset + 1;
      node = node.parent;
    }

    return treePos;
  }

  /**
   * findTreePos finds the position of the given index in the tree.
   */
  public findTreePos(index: number, preperInline = true): TreePos<T> {
    return findTreePos(this.root, index, preperInline);
  }

  /**
   * `treePosToPath` returns path from given treePos
   */
  public treePosToPath(treePos: TreePos<T>) {
    const path = [];

    if (treePos.node.isInline || !treePos.node.parent) {
      path.push(treePos.offset);
    }

    let node = treePos.node;

    while (node.parent) {
      const pathInfo = node.parent.children.indexOf(node);

      if (!~pathInfo) {
        throw new Error('invalid treePos');
      }

      path.push(pathInfo);

      node = node.parent;
    }

    return path.reverse();
  }

  /**
   * `pathToTreePos` returns treePos from given path
   */
  public pathToTreePos(path: Array<number>): TreePos<T> {
    if (!path.length) {
      throw new Error('unacceptable path');
    }

    let node = this.root;
    for (let i = 0; i < path.length - 1; i++) {
      const pathElement = path[i];
      node = node.children[pathElement];

      if (!node) {
        throw new Error('unacceptable path');
      }
    }

    if (node.hasInlineChild()) {
      return findInlinePos(node, path[path.length - 1]);
    }

    if (node.children.length < path[path.length - 1]) {
      throw new Error('unacceptable path');
    }

    return {
      node,
      offset: path[path.length - 1],
    };
  }

  /**
   * `getRoot` returns the root node of the tree.
   */
  public getRoot(): T {
    return this.root;
  }

  /**
   * `getSize` returns the size of the tree.
   */
  public get size(): number {
    return this.root.size;
  }

  /**
   * `findPostorderRight` finds right node of the given tree position with
   *  postorder traversal.
   */
  public findPostorderRight(treePos: TreePos<T>): T | undefined {
    const { node, offset } = treePos;

    if (node.isInline) {
      if (node.size === offset) {
        const nextSibling = node.nextSibling;
        if (nextSibling) {
          return nextSibling;
        }

        return node.parent;
      }

      return node;
    }

    if (node.children.length === offset) {
      return node;
    }

    return findLeftmost(node.children[offset]);
  }

  /**
   * `indexOf` returns the index of the given node.
   */
  public indexOf(node: T): number {
    let index = 0;
    let current = node;
    while (current !== this.root) {
      const parent = current.parent;
      if (!parent) {
        throw new Error(`parent is not found`);
      }

      const offset = parent.findOffset(current);
      for (const previous of parent.children.slice(0, offset)) {
        index += previous.paddedSize;
      }

      // If this step escape from block node, we should add 1 to the index,
      // because the block node has open tag.
      if (current !== this.root && current !== node && !current.isInline) {
        index += 1;
      }

      current = parent;
    }

    return index;
  }

  /**
   * `indexToPath` returns the path of the given index.
   */
  public indexToPath(index: number): Array<number> {
    const treePos = this.findTreePos(index);

    return this.treePosToPath(treePos);
  }
}