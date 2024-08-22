//
// Copyright 2020 The Yorkie Authors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @generated by protoc-gen-es v1.6.0 with parameter "target=js+dts,js_import_style=module"
// @generated from file src/api/yorkie/v1/yorkie.proto (package yorkie.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import type { ChangePack, DocEvent } from "./resources_pb.js";

/**
 * @generated from message yorkie.v1.ActivateClientRequest
 */
export declare class ActivateClientRequest extends Message<ActivateClientRequest> {
  /**
   * @generated from field: string client_key = 1;
   */
  clientKey: string;

  constructor(data?: PartialMessage<ActivateClientRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.ActivateClientRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ActivateClientRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ActivateClientRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ActivateClientRequest;

  static equals(a: ActivateClientRequest | PlainMessage<ActivateClientRequest> | undefined, b: ActivateClientRequest | PlainMessage<ActivateClientRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.ActivateClientResponse
 */
export declare class ActivateClientResponse extends Message<ActivateClientResponse> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  constructor(data?: PartialMessage<ActivateClientResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.ActivateClientResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ActivateClientResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ActivateClientResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ActivateClientResponse;

  static equals(a: ActivateClientResponse | PlainMessage<ActivateClientResponse> | undefined, b: ActivateClientResponse | PlainMessage<ActivateClientResponse> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.DeactivateClientRequest
 */
export declare class DeactivateClientRequest extends Message<DeactivateClientRequest> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  constructor(data?: PartialMessage<DeactivateClientRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.DeactivateClientRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeactivateClientRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeactivateClientRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeactivateClientRequest;

  static equals(a: DeactivateClientRequest | PlainMessage<DeactivateClientRequest> | undefined, b: DeactivateClientRequest | PlainMessage<DeactivateClientRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.DeactivateClientResponse
 */
export declare class DeactivateClientResponse extends Message<DeactivateClientResponse> {
  constructor(data?: PartialMessage<DeactivateClientResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.DeactivateClientResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeactivateClientResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeactivateClientResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeactivateClientResponse;

  static equals(a: DeactivateClientResponse | PlainMessage<DeactivateClientResponse> | undefined, b: DeactivateClientResponse | PlainMessage<DeactivateClientResponse> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.AttachDocumentRequest
 */
export declare class AttachDocumentRequest extends Message<AttachDocumentRequest> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 2;
   */
  changePack?: ChangePack;

  constructor(data?: PartialMessage<AttachDocumentRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.AttachDocumentRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AttachDocumentRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AttachDocumentRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AttachDocumentRequest;

  static equals(a: AttachDocumentRequest | PlainMessage<AttachDocumentRequest> | undefined, b: AttachDocumentRequest | PlainMessage<AttachDocumentRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.AttachDocumentResponse
 */
export declare class AttachDocumentResponse extends Message<AttachDocumentResponse> {
  /**
   * @generated from field: string document_id = 1;
   */
  documentId: string;

  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 2;
   */
  changePack?: ChangePack;

  constructor(data?: PartialMessage<AttachDocumentResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.AttachDocumentResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AttachDocumentResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AttachDocumentResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AttachDocumentResponse;

  static equals(a: AttachDocumentResponse | PlainMessage<AttachDocumentResponse> | undefined, b: AttachDocumentResponse | PlainMessage<AttachDocumentResponse> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.DetachDocumentRequest
 */
export declare class DetachDocumentRequest extends Message<DetachDocumentRequest> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  /**
   * @generated from field: string document_id = 2;
   */
  documentId: string;

  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 3;
   */
  changePack?: ChangePack;

  /**
   * @generated from field: bool remove_if_not_attached = 4;
   */
  removeIfNotAttached: boolean;

  constructor(data?: PartialMessage<DetachDocumentRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.DetachDocumentRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DetachDocumentRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DetachDocumentRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DetachDocumentRequest;

  static equals(a: DetachDocumentRequest | PlainMessage<DetachDocumentRequest> | undefined, b: DetachDocumentRequest | PlainMessage<DetachDocumentRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.DetachDocumentResponse
 */
export declare class DetachDocumentResponse extends Message<DetachDocumentResponse> {
  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 2;
   */
  changePack?: ChangePack;

  constructor(data?: PartialMessage<DetachDocumentResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.DetachDocumentResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DetachDocumentResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DetachDocumentResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DetachDocumentResponse;

  static equals(a: DetachDocumentResponse | PlainMessage<DetachDocumentResponse> | undefined, b: DetachDocumentResponse | PlainMessage<DetachDocumentResponse> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.WatchDocumentRequest
 */
export declare class WatchDocumentRequest extends Message<WatchDocumentRequest> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  /**
   * @generated from field: string document_id = 2;
   */
  documentId: string;

  constructor(data?: PartialMessage<WatchDocumentRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.WatchDocumentRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WatchDocumentRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WatchDocumentRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WatchDocumentRequest;

  static equals(a: WatchDocumentRequest | PlainMessage<WatchDocumentRequest> | undefined, b: WatchDocumentRequest | PlainMessage<WatchDocumentRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.WatchDocumentResponse
 */
export declare class WatchDocumentResponse extends Message<WatchDocumentResponse> {
  /**
   * @generated from oneof yorkie.v1.WatchDocumentResponse.body
   */
  body: {
    /**
     * @generated from field: yorkie.v1.WatchDocumentResponse.Initialization initialization = 1;
     */
    value: WatchDocumentResponse_Initialization;
    case: "initialization";
  } | {
    /**
     * @generated from field: yorkie.v1.DocEvent event = 2;
     */
    value: DocEvent;
    case: "event";
  } | { case: undefined; value?: undefined };

  constructor(data?: PartialMessage<WatchDocumentResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.WatchDocumentResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WatchDocumentResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WatchDocumentResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WatchDocumentResponse;

  static equals(a: WatchDocumentResponse | PlainMessage<WatchDocumentResponse> | undefined, b: WatchDocumentResponse | PlainMessage<WatchDocumentResponse> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.WatchDocumentResponse.Initialization
 */
export declare class WatchDocumentResponse_Initialization extends Message<WatchDocumentResponse_Initialization> {
  /**
   * @generated from field: repeated string client_ids = 1;
   */
  clientIds: string[];

  constructor(data?: PartialMessage<WatchDocumentResponse_Initialization>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.WatchDocumentResponse.Initialization";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WatchDocumentResponse_Initialization;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WatchDocumentResponse_Initialization;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WatchDocumentResponse_Initialization;

  static equals(a: WatchDocumentResponse_Initialization | PlainMessage<WatchDocumentResponse_Initialization> | undefined, b: WatchDocumentResponse_Initialization | PlainMessage<WatchDocumentResponse_Initialization> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.RemoveDocumentRequest
 */
export declare class RemoveDocumentRequest extends Message<RemoveDocumentRequest> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  /**
   * @generated from field: string document_id = 2;
   */
  documentId: string;

  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 3;
   */
  changePack?: ChangePack;

  constructor(data?: PartialMessage<RemoveDocumentRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.RemoveDocumentRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RemoveDocumentRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RemoveDocumentRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RemoveDocumentRequest;

  static equals(a: RemoveDocumentRequest | PlainMessage<RemoveDocumentRequest> | undefined, b: RemoveDocumentRequest | PlainMessage<RemoveDocumentRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.RemoveDocumentResponse
 */
export declare class RemoveDocumentResponse extends Message<RemoveDocumentResponse> {
  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 1;
   */
  changePack?: ChangePack;

  constructor(data?: PartialMessage<RemoveDocumentResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.RemoveDocumentResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RemoveDocumentResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RemoveDocumentResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RemoveDocumentResponse;

  static equals(a: RemoveDocumentResponse | PlainMessage<RemoveDocumentResponse> | undefined, b: RemoveDocumentResponse | PlainMessage<RemoveDocumentResponse> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.PushPullChangesRequest
 */
export declare class PushPullChangesRequest extends Message<PushPullChangesRequest> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  /**
   * @generated from field: string document_id = 2;
   */
  documentId: string;

  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 3;
   */
  changePack?: ChangePack;

  /**
   * @generated from field: bool push_only = 4;
   */
  pushOnly: boolean;

  constructor(data?: PartialMessage<PushPullChangesRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.PushPullChangesRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PushPullChangesRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PushPullChangesRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PushPullChangesRequest;

  static equals(a: PushPullChangesRequest | PlainMessage<PushPullChangesRequest> | undefined, b: PushPullChangesRequest | PlainMessage<PushPullChangesRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.PushPullChangesResponse
 */
export declare class PushPullChangesResponse extends Message<PushPullChangesResponse> {
  /**
   * @generated from field: yorkie.v1.ChangePack change_pack = 1;
   */
  changePack?: ChangePack;

  constructor(data?: PartialMessage<PushPullChangesResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.PushPullChangesResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PushPullChangesResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PushPullChangesResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PushPullChangesResponse;

  static equals(a: PushPullChangesResponse | PlainMessage<PushPullChangesResponse> | undefined, b: PushPullChangesResponse | PlainMessage<PushPullChangesResponse> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.BroadcastRequest
 */
export declare class BroadcastRequest extends Message<BroadcastRequest> {
  /**
   * @generated from field: string client_id = 1;
   */
  clientId: string;

  /**
   * @generated from field: string document_id = 2;
   */
  documentId: string;

  /**
   * @generated from field: string topic = 3;
   */
  topic: string;

  /**
   * @generated from field: bytes payload = 4;
   */
  payload: Uint8Array;

  constructor(data?: PartialMessage<BroadcastRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.BroadcastRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BroadcastRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BroadcastRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BroadcastRequest;

  static equals(a: BroadcastRequest | PlainMessage<BroadcastRequest> | undefined, b: BroadcastRequest | PlainMessage<BroadcastRequest> | undefined): boolean;
}

/**
 * @generated from message yorkie.v1.BroadcastResponse
 */
export declare class BroadcastResponse extends Message<BroadcastResponse> {
  constructor(data?: PartialMessage<BroadcastResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "yorkie.v1.BroadcastResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BroadcastResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BroadcastResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BroadcastResponse;

  static equals(a: BroadcastResponse | PlainMessage<BroadcastResponse> | undefined, b: BroadcastResponse | PlainMessage<BroadcastResponse> | undefined): boolean;
}
